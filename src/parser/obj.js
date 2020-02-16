import { parseCOS } from "../utils/cos.js";
/**
 * Pattern:
 *    5 0 obj
 *    3119
 *    endobj
 *
 * @param {string} str
 * @returns {object}
 *
 */
export function parseObj(str) {
  const regex_obj = /(\d+)\s\d+\sobj\r?\n?/g;
  const regex_endobj = /\r?\n?endobj/g;
  const objects = [""];
  let obj;

  while ((obj = regex_obj.exec(str))) {
    let startIndex = obj.index + obj[0].length;
    let endIndex = regex_endobj.exec(str).index;
    if (endIndex > startIndex) {
      objects[obj[1]] = str.substring(startIndex, endIndex);
    }
  }

  return objects.map(obj => parseCOS(obj));
}
