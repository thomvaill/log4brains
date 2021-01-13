/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/no-try-expect */
import execa from "execa";
import path from "path";
import os from "os";
import fs, { promises as fsP } from "fs";
import rimraf from "rimraf";

// Source: https://shift.infinite.red/integration-testing-interactive-clis-93af3cc0d56f. Thanks!
const keys = {
  up: "\x1B\x5B\x41",
  down: "\x1B\x5B\x42",
  enter: "\x0D",
  space: "\x20"
};

// TODO: to rewrite completely. Because now we can just import the CLI and test it directly, not with execa (dirty!)
// TODO: deactivated for now because there is an asynchronous issue when exectued in GitHub Actions
// We should rewrite this...
throw new Error("Tests deactivated");

// Inspired by Next.js's test/integration/create-next-app/index.test.js. Thank you!
const cliPath = path.join(__dirname, "fake-entrypoint.ts");
const run = (cwd: string) =>
  execa("node", ["-r", "esm", "-r", "ts-node/register", cliPath, "init", cwd]);

jest.setTimeout(1000 * 60);

async function usingTempDir(fn: (cwd: string) => void | Promise<void>) {
  const folder = await fsP.mkdtemp(
    path.join(os.tmpdir(), "log4brains-init-tests-")
  );
  try {
    await fn(folder);
  } finally {
    rimraf.sync(folder);
  }
}

type PackageAnswer = {
  name: string;
  path: string;
  adrFolder: string;
};
// eslint-disable-next-line sonarjs/cognitive-complexity
function bindAnswers(
  cli: execa.ExecaChildProcess<string>,
  packageAnswer?: PackageAnswer
): execa.ExecaChildProcess<string> {
  if (!cli.stdout) {
    throw new Error("CLI must have an stdout");
  }

  let name = false;
  let type = false;
  let adrFolder = false;
  let packageName = false;
  let packagePath = false;
  let packageAdrFolder = false;
  let packageDone = false;
  cli.stdout.on("data", (data: Buffer) => {
    const line = data.toString();
    if (!cli.stdin) {
      throw new Error("CLI must have an stdin");
    }

    if (!name && line.match(/Continue\?/)) {
      cli.stdin.write("\n");
    }
    if (!name && line.match(/What is the name of your project\?/)) {
      cli.stdin.write("Test\n");
      name = true;
    }
    if (
      !type &&
      line.match(/Which statement describes the best your project\?/)
    ) {
      if (packageAnswer) {
        cli.stdin.write(keys.down);
      }
      cli.stdin.write("\n");
      type = true;
    }
    if (
      !adrFolder &&
      line.match(
        /In which directory do you plan to store your( global)? ADRs\?/
      )
    ) {
      cli.stdin.write("\n");
      adrFolder = true;
    }

    // Multi only:
    if (packageAnswer) {
      if (!packageName && line.match(/Name\?/)) {
        cli.stdin.write(`${packageAnswer.name}\n`);
        packageName = true;
      }
      if (
        !packagePath &&
        line.match(/Where is located the source code of this package\?/)
      ) {
        cli.stdin.write(`${packageAnswer.path}\n`);
        packagePath = true;
      }
      if (
        !packageAdrFolder &&
        line.match(
          /In which directory do you plan to store the ADRs of this package\?/
        )
      ) {
        cli.stdin.write(`${packageAnswer.adrFolder}\n`);
        packageAdrFolder = true;
      }
      if (!packageDone && line.match(/Do you want to add another one\?/)) {
        cli.stdin.write(`N\n`);
        packageDone = true;
      }
    }
  });
  return cli;
}

describe("Init", () => {
  test("mono package project", async () => {
    await usingTempDir(async (cwd) => {
      await execa("npm", ["init", "--yes"], { cwd }); // TODO: without this line, the test hangs! Find out why
      await bindAnswers(run(cwd));

      expect(fs.existsSync(path.join(cwd, ".log4brains.yml"))).toBeTruthy(); // TODO: test its content
      expect(fs.existsSync(path.join(cwd, "docs/adr"))).toBeTruthy();
      expect(
        fs.existsSync(path.join(cwd, "docs/adr/template.md"))
      ).toBeTruthy();
      expect(fs.existsSync(path.join(cwd, "docs/adr/index.md"))).toBeTruthy();
      expect(fs.existsSync(path.join(cwd, "docs/adr/README.md"))).toBeTruthy();
    });
  });

  test("multi packages project", async () => {
    await usingTempDir(async (cwd) => {
      await execa("npm", ["init", "--yes"], { cwd }); // TODO: without this line, the test hangs! Find out why
      await execa("mkdir", ["-p", "packages/package1"], { cwd });

      await bindAnswers(run(cwd), {
        name: "package1",
        path: "packages/package1",
        adrFolder: "packages/package1/docs/adr"
      });

      expect(fs.existsSync(path.join(cwd, ".log4brains.yml"))).toBeTruthy(); // TODO: test its content
      expect(fs.existsSync(path.join(cwd, "docs/adr"))).toBeTruthy();
      expect(
        fs.existsSync(path.join(cwd, "packages/package1/docs/adr"))
      ).toBeTruthy();
    });
  });
});
