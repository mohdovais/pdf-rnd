export const date_regex = /\(D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?([-+Z])(\d{2})'(\d{2})'\)/;

/**
 * Except Year, rest of the values are optionl
 *
 * 0: "(D:20200217202038Z00'00')"
 * @returns {String} ISO Date String
 */
export function readDate(str) {
  const d = date_regex.exec(str);
  return (
    d[1] +
    "-" +
    (d[2] || "00") +
    "-" +
    (d[3] || "00") +
    "T" +
    (d[4] || "00") +
    ":" +
    (d[5] || "00") +
    ":" +
    (d[6] || "00") +
    ".000" +
    (d[7] === "Z" ? "Z" : d[7] + (d[8] || "00") + ":" + (d[9] || "00"))
  );
}
