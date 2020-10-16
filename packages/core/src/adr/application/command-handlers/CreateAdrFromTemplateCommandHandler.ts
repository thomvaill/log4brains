import { CommandHandler } from "@src/application";
import { CreateAdrFromTemplateCommand } from "../commands";

export class CreateAdrFromTemplateCommandHandler
  implements CommandHandler<CreateAdrFromTemplateCommand> {
  readonly commandClass = CreateAdrFromTemplateCommand;

  execute(command: CreateAdrFromTemplateCommand): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
