import { SailerCli } from "./SailerCli";

describe("Test SailerCli", () => {
  test("Check --version", async () => {
    expect.assertions(1);
    const cli = new SailerCli();
    const argv = ["version" ];
    await cli.executeAsync(argv);
    expect(cli.getFlagParameter("--version").value).toBe(true);
  });
});
