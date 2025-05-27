export function units(vControllerData: any) {
  const unitArray = Object.values(
    vControllerData._parameter as { unit: any }[]
  ).map((value) => value.unit);
  return uniq(unitArray);
}

function uniq(array: any[]): any[] {
  const set = new Set(array);
  return [...set];
}
