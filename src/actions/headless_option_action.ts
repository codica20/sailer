import { CommandLineAction, CommandLineFlagParameter } from "@rushstack/ts-command-line";

/** a base class to be extended. It provides the Headless flag. */

export abstract class HeadlessOptionAction extends CommandLineAction {
  public _headlessBrowser: CommandLineFlagParameter;
  public constructor(args: { actionName: string; documentation: string; summary: string; }) {
    super(args);
    this._headlessBrowser = this.defineFlagParameter({
      parameterLongName: "--headless",
      description: "If set, browser for remote portal runs headless.",
    });
  }
  public getHeadlessBrowser(): boolean {
    return this.getFlagParameter("--headless").value;
  }

}
