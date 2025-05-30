import vControllerData from "../../data/vControllerData.json";
import {
  org_params,
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
      titleArray.filter((title) => title.includes("ollekt"))
    );
    const paramArray = org_params(vControllerData);
    expect(titleArray.length).toEqual(paramArray.length);
  });
});
