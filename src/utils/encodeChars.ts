/** returns an identifier name from a text string
 *
 */
export function encodeChars(decoded: string): string {
  const keyMap: { [key: string]: string; } = {
    " ": "_",
    ß: "ss",
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "ae",
    Ö: "oe",
    Ü: "ue",
    ".": "_",
    ":": "_",
  };
  const result: string[] = [];
  let underscore: boolean = false;
  for (const a of decoded) {
    const value = keyMap[a];
    // only one underscore in a row
    const encodedToken = value || a.toLowerCase();
    if (encodedToken == "_") {
      if (!underscore) {
        result.push("_");
        underscore = true;
      }
      // do not push an underscore, if already pushed
    } else {
      result.push(encodedToken);
      underscore = false;
    }
  }
  return result.join("");
}
