import { Browser } from "puppeteer";
import vControllerData from "../../data/vControllerData.json";
import {
  interpretedValues,
  sKeys,
  VControllerData,
} from "../remoteportal/analyzeData";
import { getDashboardSource } from "../remoteportal/getPageSource";

export async function getParam(
  dryRun: boolean,
  filterPattern?: string
): Promise<void> {
  let data: VControllerData;
  let browser:Browser|undefined;
  if (dryRun) {
    data = vControllerData;
  } else {
    const source = await getDashboardSource();
    data = source.vControllerData;
    browser = source.browser;
    console.log({browser})
  }
  let sValues= interpretedValues(vControllerData,filterPattern);
  if (filterPattern) {
    const regex = new RegExp(filterPattern);
    sValues = sValues.filter((interpVal) => regex.exec(interpVal.title));
  }
  console.log(sValues);
  if(browser){
    console.log("Closing browser ...")
    await browser.close();
    console.log("Browser closed.")
  }
}
