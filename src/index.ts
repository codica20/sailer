#!/usr/bin/env node

import { getDashboardSource } from "./remoteportal/getPageSource";
import { SailerCli } from "./SailerCli";
import { wait4user } from "./utils/wait4user";

const cli = new SailerCli();
cli.executeAsync().then(async () => {
  console.log({ versionFlag: cli._version });
  const {browser,content}=await getDashboardSource();
  console.log(content);
  await wait4user();
  console.log("Exiting...");
  await browser.close();
  console.log("Good Bye!");
});
