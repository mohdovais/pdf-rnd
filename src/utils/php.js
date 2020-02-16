/**
 *  The following values are considered to be empty:
 *    1. "" (an empty string)
 *    2. 0 (0 as an integer)
 *    3. 0.0 (0 as a float)
 *    4. "0" (0 as a string)
 *    5. NULL
 *    6. FALSE
 *    7. array() (an empty array)
 */
export function empty(subject) {
  if (subject === undefined || subject === null) {
    return true;
  }
  switch (typeof subject) {
    case "string":
      return subject === "" || subject === "0";
    case "number":
      return subject === 0;
    case "boolean":
      return subject === false;
    case "object":
      return Array.isArray(subject) && subject.length === 0;
    default:
      return false;
  }
}

/**
 *
 * @param {any} subject
 * @param {number} radix
 * @returns {number}
 */
export function intval(subject, radix = 10) {
  return parseInt(subject, radix);
}

export const PREG_OFFSET_CAPTURE = 1;

/**
 *
 * @param {Array} result
 */
function preg_match_offset_capture(result) {
  const result0 = result[0];
  const resultIndex = result.index;

  if (result.length === 1) {
    return [[result0, resultIndex]];
  } else {
    let resultLastIndexOf = 0;
    return result.map((item, index) => {
      if (index === 0) {
        resultLastIndexOf = resultIndex;
        return [item, resultIndex];
      } else {
        resultLastIndexOf =
          resultIndex + result0.indexOf(item, resultLastIndexOf);
        return [item, resultLastIndexOf];
      }
    });
  }
}

/**
 *
 * @param {RegExp} regex
 * @param {string} pdfdata
 * @param {number} offset
 */
export function preg_match(regex, subject, flag, offset = 0) {
  if (offset !== 0) {
    regex.lastIndexOf = offset;
  }
  var result = subject.match(regex);
  if (result === null) return null;
  if (flag === PREG_OFFSET_CAPTURE) {
    return preg_match_offset_capture(result);
  } else {
    result.map(x => x);
  }
}
