import vControllerData from "../../data/vControllerData.json";
import {
  getOrgParam,
  orgParams,
  parsedValue,
  titles,
  uniqTitles,
  units,
} from "./analyzeData";

describe("tests analyzeData.ts", () => {
  test("sample vControllerData exists", () => {
    expect.assertions(1);
    expect(vControllerData).toHaveProperty("_parameter");
  });

  test("Different units of measurements exist", () => {
    const result = units(vControllerData);
    expect(result).toStrictEqual([
      "°C",
      "%",
      "l/min",
      "kW",
      "d",
      null,
      "V",
      "h",
      "kWh",
      "MWh",
      "min",
      "s",
      "K",
    ]);
  });

  test("Different titles exist", () => {
    const result = titles(vControllerData);
    expect(result).toHaveLength(333);
    expect(result.slice(0, 3)).toStrictEqual([
      "1. Nachstellzeit",
      "1. P-Faktor",
      "1. Zapffluss",
    ]);
  });

  test("Uniqtitles are unique", () => {
    const titleArray = uniqTitles(vControllerData);
    console.log(
      titleArray.filter((title) => title.includes("UM1"))
    );
    const paramArray = orgParams(vControllerData);
    expect(titleArray.length).toEqual(paramArray.length);
  });

  test("Kollektortemperatur", () => {
    const result = getOrgParam(
      vControllerData,
      "F1: Kollektor"
    );
    console.log({ result });
    expect(result.value).toEqual("192");
    expect(parsedValue(result)).toBeCloseTo(19.2);
  });


  test("Heizanforderung", () => {
    const result = getOrgParam(
      vControllerData,
      "Ausgänge_UM1"
    );
    console.log({ result });
    expect(result.value).toEqual("1");
    expect(parsedValue(result)).toEqual(1);
  });
});
