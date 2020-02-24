import { read } from "../stream.js";

/**
 * @param {Object} stream
 * @param {Array} array
 * @returns {Array}
 */
export function readArray(stream, array) {
  var token = read(stream);
  var proceed = true;

  while (proceed) {
    let exec = /(.*)]$/.exec(token);
    if (exec === null) {
      array.push(token);
      token = read(stream);
    } else {
      if (exec[1] !== "") {
        array.push(number_safe(exec[1]));
      }
      proceed = false;
    }
  }

  return array;
}
