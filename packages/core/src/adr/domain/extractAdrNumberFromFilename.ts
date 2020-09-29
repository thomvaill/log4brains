export function extractAdrNumberFromFilename(
  filename: string
): number | undefined {
  const regex = /^(?:adr(?:-|_)?)?(\d+).*\.md$/i;
  const res = regex.exec(filename);
  return res ? parseInt(res[1], 10) : undefined;
}
