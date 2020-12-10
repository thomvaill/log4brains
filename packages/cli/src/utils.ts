import hasYarn from "has-yarn";
import execa from "execa";

export async function previewAdr(slug: string): Promise<void> {
  const subprocess = hasYarn()
    ? execa("yarn", ["run", "log4brains-preview", slug], {
        stdio: "inherit"
      })
    : execa("npm", ["run", "--silent", "log4brains-preview", "--", slug], {
        stdio: "inherit"
      });
  subprocess.stdout?.pipe(process.stdout);
  subprocess.stderr?.pipe(process.stderr);
  await subprocess;
}
