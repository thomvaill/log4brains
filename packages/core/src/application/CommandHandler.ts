import { Command } from "./Command";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CommandHandler<C extends Command = any> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly commandClass: Function;
  execute(command: C): Promise<void>;
}
