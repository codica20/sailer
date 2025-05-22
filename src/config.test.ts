import { sailerPassword, sailerUser } from "./config";

describe("Test config.ts", () => {
  test("Password is set", () => {
    // Check if SAILER_PASSWORD in file .env is set
    expect(sailerPassword?.length).toBeGreaterThan(5);
  });
  test("User is set", () => {
    // Check if SAILER_USER in file .env is set
    expect(sailerUser?.length).toBeGreaterThan(5);
  });
});
