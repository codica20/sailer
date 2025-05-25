import * as readline from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";

/** wait for Enter key on console
 *
 * call it by
 *   await wait4user();
 *
 * For another method cf.
 *   https://stackoverflow.com/questions/19687407/press-any-key-to-continue-in-nodejs
 */
export const wait4user = async (
  msg?: string
): Promise<string> => {
  const rl = readline.createInterface({ input, output });

  const answer = await rl.question(
    msg || "Please, press ENTER "
  );

  rl.close();
  return answer;
};
