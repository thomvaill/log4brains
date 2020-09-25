import slugifyFn from "slugify";

// used to slugify markdown paragraph IDs
export function slugify(string: string): string {
  return slugifyFn(string, {
    lower: true,
    strict: true
  });
}
