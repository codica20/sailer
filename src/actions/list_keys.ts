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
  if (dummyData) {
    data = vControllerData;
  } else {
    const source = await getDashboardSource();
    data = source.vControllerData;
  }
  let titles = sKeys(data);
  if (filterPattern) {
    const regex = new RegExp(filterPattern);
    titles = titles.filter((key) => regex.exec(key));
  }
  console.log(titles);
}
