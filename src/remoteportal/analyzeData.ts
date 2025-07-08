import { jsoning } from "../utils/jsoning";

export type VControllerData = {
  [key: string]: any;
  _parameter: { [key: string]: VCDParamValue };
};

export type VCDParamValue = {
  parameter_group_title?: string;
  title: string;
  title_short1: string | null;
  title_translated: string | number;
  value: string;
  factor: string;
  unit: string | null;
  /** "0"|"1" */
  is_readonly: string;
  parameter_type: string; // "variable" | "bit";
  value_list?: VList;
  //  [key: string]: string | null | number | VList | undefined;
};

export type VList = { [key: string]: string } | string[];

export type SailerValue = {
  title: string;
} & (SailerVariable | SailerBit);

export type SailerVariable = {
  type: "variable";
  unit: string | null;
  value: number;
};
export type SailerBit = {
  type: "bit";
  value: boolean;
};

export function units(vControllerData: VControllerData) {
  const unitArray = Object.values(
    vControllerData._parameter
  ).map((value) => value.unit);
  return uniq(unitArray);
}

export function titles(vControllerData: VControllerData) {
  const array = Object.values(
    vControllerData._parameter
  ).map((value) => value.title);
  return uniq(array).sort();
}

export function sKeys(vControllerData: VControllerData) {
  const result = orgParams(vControllerData).map((param) =>
    sKey(param)
  );
  return result.sort();
}

export function sKey({
  parameter_group_title,
  title,
  title_short1,
}: VCDParamValue): string {
  const prefix = parameter_group_title
    ? `${parameter_group_title}_`
    : "";
  const suffix = title_short1 ? `_${title_short1}` : "";
  return `${prefix}${title}${suffix}`;
}

/** calculates value from factor and original value.
 *
 */
export function parsedNumberValue({
  factor,
  value,
}: VCDParamValue): number {
  const parsedFactor = parseFloat(factor);
  const parsedOrgValue = parseInt(value);
  const result = parsedFactor * parsedOrgValue;
  return result;
}

export function orgParams(
  vControllerData: VControllerData
): VCDParamValue[] {
  return Object.values(vControllerData._parameter);
}

export function getOrgParam(
  vControllerData: VControllerData,
  uniqueTitle: string
): VCDParamValue {
  const result = orgParams(vControllerData).find(
    (param) => sKey(param) === uniqueTitle
  );
  if (result) return result;
  else
    throw Error(`Unique title ${uniqueTitle} not found!`);
}

export function interpretedValue(
  param: VCDParamValue
): SailerValue {
  const title = sKey(param);
  switch (param.parameter_type) {
    case "bit": {
      const value = param.value === "1";
      return { title, type: "bit", value };
    }
    case "variable":
      const value = parsedNumberValue(param);
      const readOnly = param.is_readonly === "1";
      const type = param.parameter_type;
      const unit = param.unit;
      return { title, type, unit, value };
    default:
      throw new Error(
        `Parameter_type ${
          param.parameter_type
        } wird nicht unterstützt.\n${jsoning(param)}`
      );
  }
}

export function interpretedValues(
  vControllerData: VControllerData,
  filterPattern?: string
): SailerValue[] {
  const originalParams = orgParams(vControllerData);
  const filteredParams = filterPattern
    ? originalParams.filter((param) =>
        new RegExp(filterPattern).exec(sKey(param))
      )
    : originalParams;
  const interpretedValues = filteredParams.map((param) =>
    interpretedValue(param)
  );
  return interpretedValues;
}

/** returns an array with unique elements
 *
 */
function uniq(array: any[]): any[] {
  const set = new Set(array);
  return [...set];
}
