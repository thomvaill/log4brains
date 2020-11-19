const execa = require("execa");
const rimraf = require("rimraf");
const os = require("os");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const fsP = fs.promises;

process.env.NODE_ENV = "test";

const initBin = path.resolve(
  path.join(__dirname, "../packages/init/dist/log4brains-init")
);

// Inspired by Next.js's test/integration/create-next-app/index.test.js. Thank you!
async function usingTempDir(fn) {
  const folder = await fsP.mkdtemp(path.join(os.tmpdir(), "log4brains-e2e-"));
  console.log(chalk.bold(`${chalk.green("WORKDIR")} ${folder}`));
  try {
    return await fn(folder);
  } finally {
    rimraf.sync(folder);
  }
}

async function run(file, arguments, cwd) {
  console.log(
    chalk.bold(`${chalk.green("RUN")} ${file} ${arguments.join(" ")}`)
  );
  const childProcess = execa(file, arguments, { cwd });
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  return await childProcess;
}

(async () => {
  await usingTempDir(async (cwd) => {
    await run("npm", ["init", "--yes"], cwd);
    await run("npm", ["install"], cwd);
    await run(initBin, ["--defaults"], cwd);

    const adrListRes = await run(
      "npm",
      ["run", "adr", "--", "list", "--raw"],
      cwd
    );
    console.log(adrListRes);
  });
})().catch((e) => {
  console.error("");
  console.error(`${chalk.red.bold("== FATAL ERROR ==")}`);
  console.error(e);
  process.exit(1);
});
