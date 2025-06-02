import { Browser } from "puppeteer";
import vControllerData from "../../data/vControllerData.json";
import {
  sKeys,
  VControllerData,
} from "../remoteportal/analyzeData";
import { getDashboardSource } from "../remoteportal/getPageSource";

export async function listKeys(
  dummyData: boolean,
  filterPattern?: string
): Promise<void> {
  let data: VControllerData;
  let browser: Browser | undefined;
  if (dummyData) {
    data = vControllerData;
  } else {
    const source = await getDashboardSource();
    data = source.vControllerData;
    browser=source.browser;
  }
  let sailerKeys = sKeys(data);
  if (filterPattern) {
    const regex = new RegExp(filterPattern);
    sailerKeys = sailerKeys.filter((key) => regex.exec(key));
  }
  console.log(sailerKeys);
  if(browser) {
    console.log("Closing browser...")
    await browser.close();
  }

}
