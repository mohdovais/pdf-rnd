import { parseCOS } from "./cos.js";

/**
 * There can be many `trailer` for each version of pdf edit.
 * We are only interested in last one.
 * 
 * @param {string} str
 * @returns {null|Object} key-value map
 */
export function parseTrailer(str) {
  const exec = /trailer\r?\n(<<[\s\S]+>>)/.exec(
    str.substring(str.lastIndexOf("trailer"))
  );
  return exec && parseCOS(exec[1]);
}
