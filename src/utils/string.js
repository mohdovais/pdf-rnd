export function isEmpty(str) {
  return typeof str !== "string" || str === "";
}

/**
 * PHP preg_match_all
 * PREG_SET_ORDER
 *
 * @param {RegExp} regexr
 * @param {string} str
 * @param {number} offset
 *
 * @returns {Array}
 */
export function preg_match_all(regexr, str, offset = 0) {
  var matchAll = [];
  let match;

  regexr.lastIndex = offset;

  while ((match = regexr.exec(str)) !== null) {
    matchAll.push(match);
  }

  return matchAll;
}

export function preg_match(regexr, str, offset = 0) {
  regexr.lastIndex = offset;
  return regexr.exec(str);
}
