import vControllerData from "../../data/vControllerData.json";
import { units } from "./analyzeData";

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
});
