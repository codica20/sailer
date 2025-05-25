import puppeteer from "puppeteer";
import { sailerPassword, sailerUser } from "../config";
import { wait4user } from "../utils/wait4user";
import { setTimeout } from "timers/promises";

/** returns the content of the dashboard page of the sailer remote portal.
 * Do NOT forget to close the browser after calling the function.
 */
export async function getDashboardSource() {
  const startUrl = "https://sailer.remoteportal.de/";
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(startUrl);
  const cookieConfirmSelector = "::-p-text(Bestätigen)";
  await page.waitForSelector(cookieConfirmSelector);
  await page.locator(cookieConfirmSelector).click();
  await page
    .locator("input#formElement_login_username")
    .fill(sailerUser);
  await page
    .locator("input#formElement_login_password")
    .fill(sailerPassword);
  const submitSelector =
    "button.ibb-button ::-p-text(Anmelden)";
  const elem = await page.waitForSelector(submitSelector);
  console.log("Waiting before clicking on submit...")
  await setTimeout(500);
  //await wait4user("Before clicking on submit");
  await page.locator(submitSelector).click();
  const content = await page.content();
  return { content, browser };
}
