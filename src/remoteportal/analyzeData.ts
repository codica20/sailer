export function units(vControllerData: any) {
  const unitArray= Object.values(
    vControllerData._parameter as { unit: any }[]
  ).map((value) => value.unit);
  const unitSet=new Set(unitArray);
  return [...unitSet];
}
