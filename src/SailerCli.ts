import {
  CommandLineParser,
  CommandLineFlagParameter,
  CommandLineAction,
  CommandLineParameterWithArgument,
} from "@rushstack/ts-command-line";
import { listKeys } from "./actions/list_keys";
import { getParam } from "./actions/get_param";
import { getHAStates } from "./actions/get_ha_states";

export class SailerCli extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: "sailer",
      toolDescription: "Holt Zustände vom SAILER Master.",
    });
    this.addAction(new ListKeysAction());
    this.addAction(new GetParamAction());
    this.addAction(new GetHAStatesAction());
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
  public _dummyData: CommandLineFlagParameter;
  public _filter: CommandLineParameterWithArgument;
  public constructor() {
    super({
      actionName: "list-keys",
      documentation:
        "List possible keys for SAILER values.",
      summary: "List keys",
    });
    this._dummyData = this.defineFlagParameter({
      parameterLongName: "--dummy-data",
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
    const dummyData = this.getFlagParameter("--dummy-data").value;
    const filterPattern =
      this.getStringParameter("--filter").value;
    await listKeys(dummyData, filterPattern);
  }
}

class GetParamAction extends CommandLineAction {
  public _dummyData: CommandLineFlagParameter;
  public _filter: CommandLineParameterWithArgument;
  public constructor() {
    super({
      actionName: "get",
      documentation:
        "Get parameter values ",
      summary: "Get parameters",
    });
    this._dummyData = this.defineFlagParameter({
      parameterLongName: "--dummy-data",
      description: "Run with dummy data",
    });
    this._filter = this.defineStringParameter({
      parameterLongName: "--filter",
      description:
        "Es werden nur die Parameter angezeigt, deren Bezeichnung mit dem angegebenen Muster übereinstimmen.",
      argumentName: "MUSTER",
    });
  }
  protected async onExecuteAsync(): Promise<void> {
    const dummyData = this.getFlagParameter("--dummy-data").value;
    const filterPattern =
      this.getStringParameter("--filter").value;
    await getParam(dummyData, filterPattern);
  }
}

class GetHAStatesAction extends CommandLineAction {
  public constructor() {
    super({
      actionName: "get-ha-states",
      documentation:
        "Get Homeassistant states. Implemented for debugging purposes",
      summary: "Get Homeassistant states",
    });
  }
  protected async onExecuteAsync(): Promise<void> {
    console.log("Get states ...")
    await getHAStates();
    console.log("get ha states finished.")
  }
}

export const sailerCli = new SailerCli();
