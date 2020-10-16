/* eslint-disable @typescript-eslint/ban-types */
import { Command, CommandHandler } from "@src/application";

export class CommandBus {
  private readonly handlersByCommandName: Map<string, CommandHandler> = new Map<
    string,
    CommandHandler
  >();

  registerHandler(handler: CommandHandler, commandClass: Function): void {
    this.handlersByCommandName.set(commandClass.name, handler);
  }

  async dispatch(command: Command): Promise<void> {
    const commandName = command.constructor.name;
    const handler = this.handlersByCommandName.get(commandName);
    if (!handler) {
      throw new Error(`No handler registered for this command: ${commandName}`);
    }
    return handler.execute(command);
  }
}
