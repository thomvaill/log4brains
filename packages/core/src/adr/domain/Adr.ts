export class Adr {
  constructor(
    readonly slug: string,
    readonly number: number,
    readonly markdown: string,
    readonly title?: string
  ) {}
}
