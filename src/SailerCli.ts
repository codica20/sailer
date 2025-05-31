import {
  CommandLineParser,
  CommandLineFlagParameter,
  CommandLineAction,
  CommandLineParameterWithArgument,
} from "@rushstack/ts-command-line";
import { listKeys } from "./actions/list_keys";

export class SailerCli extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: "sailer",
      toolDescription: "Holt Zustände vom SAILER Master.",
    });
    this.addAction(new ListKeysAction());
    this.addAction(new VersionAction());
  }
}

class VersionAction extends CommandLineAction {
  public constructor() {
    super({
      actionName: "version",
      documentation: "Show sailer cli version.",
      summary: "Show version",
    });
  }
  protected async onExecuteAsync(): Promise<void> {
    console.log({
      version: require("../package.json").version,
    });
  }
}
class ListKeysAction extends CommandLineAction {
  public _dryRun: CommandLineFlagParameter;
  public _filter: CommandLineParameterWithArgument;
  public constructor() {
    super({
      actionName: "list-keys",
      documentation:
        "List possible keys for SAILER values.",
      summary: "List keys",
    });
    this._dryRun = this.defineFlagParameter({
      parameterLongName: "--dry-run",
      description: "Run with dummy data",
    });
    this._filter = this.defineStringParameter({
      parameterLongName: "--filter",
      description:
        "Es werden nur die Bezeichnungen angezeigt, die das angegebene Muster enthalten.",
      argumentName: "MUSTER",
    });
  }
  protected async onExecuteAsync(): Promise<void> {
    const dryRun = this.getFlagParameter("--dry-run").value;
    const filterPattern =
      this.getStringParameter("--filter").value;
    console.log({ listkeys: "action", dryRun });
    await listKeys(dryRun, filterPattern);
  }
}

export const sailerCli = new SailerCli();
