import execa from "execa";

export async function previewAdr(slug: string): Promise<void> {
  const subprocess = execa("log4brains", ["preview", slug], {
    stdio: "inherit"
  });
  subprocess.stdout?.pipe(process.stdout);
  subprocess.stderr?.pipe(process.stderr);
  await subprocess;
}
