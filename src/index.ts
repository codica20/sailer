#!/usr/bin/env node

import { writeFile } from "fs/promises";
import { getDashboardSource } from "./remoteportal/getPageSource";
import { sailerCli } from "./SailerCli";
import { wait4user } from "./utils/wait4user";

sailerCli.executeAsync().then(async () => {
  /*
  const { browser, content, vControllerData } =
    await getDashboardSource();
  //console.log(content);
  const htmlFileName = "/tmp/sailer.html";
  console.log("Writing content to " + htmlFileName);
  await writeFile(htmlFileName, content);
  const jsonFileName = "/tmp/sailer.json";
  console.log("Writing vControllerData to " + jsonFileName);
  const jsoned = JSON.stringify(
    vControllerData,
    undefined,
    "  "
  );
  console.log({ jsoned });
  await writeFile(jsonFileName, jsoned);
  await wait4user();
  console.log("Exiting...");
  await browser.close();
  */
  console.log("Good Bye!");
});
