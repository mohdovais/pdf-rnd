import { parseObj } from "./parser/obj.js";
import { parseTrailer } from "./parser/trailer.js";
import { parseText } from "./parser/text.js";

const regex_ref = /(\d+) \d+ R/;

/**
 * Using mutation for memory performance
 * @param {any} subject
 * @param {Array} array
 */
function replaceWithRef(subject, array) {
  //debugger;
  var exec;
  if (typeof subject === "string" && (exec = regex_ref.exec(subject))) {
    let index = array[exec[1]];
    return replaceWithRef(index, array);
  } else if (Array.isArray(subject)) {
    subject
      .filter(function isReference(item) {
        return regex_ref.test(item);
      })
      .forEach(function(item, index) {
        subject[index] = replaceWithRef(item, array);
      });
  } else if (typeof subject === "object") {
    Object.keys(subject)
      .filter(function isReference(prop) {
        // No reverse reference to avoid recursion
        return prop !== "Parent" && regex_ref.test(subject[prop]);
      })
      .forEach(function(prop) {
        let ref = subject[prop];
        subject[prop] = replaceWithRef(ref, array);
      });
  }

  return subject;
}

/**
 *
 * @param {string} str
 */
export function main(str) {
  const pdf = replaceWithRef(parseTrailer(str), parseObj(str));

  return {
    info: pdf.Info,
    pages: pdf.Root.Pages.Kids.map(function(kid) {
      return parseText(kid.Contents.stream);
    })
  };
}
