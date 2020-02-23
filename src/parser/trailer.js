import { parseCOS } from "./cos.js";

/**
 *
 * @param {string} str
 */
export function parseTrailer(str) {
  const exec = /trailer\s(<<[\s\S]+>>)/.exec(str)

  return parseCOS(exec[1]);
}
