import { parseObj } from "./parser/obj.js";
import { parseTrailer } from "./parser/trailer.js";
import { replaceWithRef } from "./parser/ref.js";
import { parseText } from "./parser/text.js";

/**
 *
 * @param {string} str
 */
export function parse(str) {
  const pdf = replaceWithRef(parseTrailer(str), parseObj(str));

  return {
    info: pdf.Info,
    pages: pdf.Root.Pages.Kids.map(function(kid) {
      return parseText(kid.Contents.stream);
    })
  };
}
