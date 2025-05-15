import { CommandLineParser, CommandLineFlagParameter } from "@rushstack/ts-command-line";

export class SailerCli extends CommandLineParser {
  public _version: CommandLineFlagParameter;
  public constructor() {
    super({
      toolFilename: "sailer",
      toolDescription: "Holt Zustände vom SAILER Master.",
    });
    this._version = this.defineFlagParameter({
      parameterLongName: "--version",
      description: "Zeige Versionsinfo.",
    });
  }
}
