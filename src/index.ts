#!/usr/bin/env node

import { SailerCli } from "./SailerCli";

const cli = new SailerCli();
cli.executeAsync().then(() => {
  console.log({ versionFlag: cli._version });
});
