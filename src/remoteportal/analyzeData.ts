export type VControllerData = {
  [key: string]: any;
  _parameter: { [key: string]: VCDParamValue };
};

export type VCDParamValue = {
  title: string;
  title_translated: string | number;
  value_list?: VList;
  [key: string]: string | null | number | VList | undefined;
};

export type VList = {[key:string]:string} | string[];

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

export function uniqTitles(
  vControllerData: VControllerData
) {
  const result = org_params(vControllerData).map((param) =>
    uniqTitle(param)
  );
  return result.sort();
}

export function uniqTitle({
  parameter_group_title,
  title,
  title_short1,
}: VCDParamValue): string {
  const prefix=parameter_group_title?`${parameter_group_title}_`:""
  const suffix=title_short1?`_${title_short1}`:"";
  return `${prefix}${title}${suffix}`;
}

export function org_params(
  vControllerData: VControllerData
): VCDParamValue[] {
  return Object.values(vControllerData._parameter);
}

/** returns an array with unique elements
 *
 */
function uniq(array: any[]): any[] {
  const set = new Set(array);
  return [...set];
}
