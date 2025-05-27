export function units(vControllerData: any) {
  const unitArray = Object.values(
    vControllerData._parameter as { unit: any }[]
  ).map((value) => value.unit);
  return uniq(unitArray);
}


export function titles(vControllerData: any) {
  const array = Object.values(
    vControllerData._parameter as { title: any }[]
  ).map((value) => value.title);
  return uniq(array).sort();
}

function uniq(array: any[]): any[] {
  const set = new Set(array);
  return [...set];
}
