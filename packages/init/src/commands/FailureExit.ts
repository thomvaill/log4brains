export class FailureExit extends Error {
  constructor() {
    super("The CLI exited with an error");
  }
}
