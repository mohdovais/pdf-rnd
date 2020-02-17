import { parseObj } from "./parser/obj.js";
import { parseTrailer } from "./parser/trailer.js";

const regex_ref = /(\d+) \d+ R/;

function getRefIndex(ref) {
  return regex_ref.exec(ref)[1] | 0;
}

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
  //console.log(str)

  //console.log(objs[18][1]);
  const objs = parseObj(str);
  const trailer = parseTrailer(str);
  const root = replaceWithRef(objs[getRefIndex(trailer.Root)], objs);
  //const info = objs[getRefIndex(trailer.Info)];
  //console.log(objs[getRefIndex(trailer.Root)])

  console.log(root);
  //console.log(info);
}
