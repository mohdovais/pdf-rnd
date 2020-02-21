/**
 *
 * @param {Array} array
 */
export function createStream(array) {
  var index = 0;
  var length = array.length;

  function read() {
    var item;
    if (index < length) {
      item = array[index];
      index++;
    }
    return item;
  }

  /**
   *
   * @param {number} relativeIndex
   */
  function seek(relativeIndex = 1) {
    var item;
    var i = index + relativeIndex - 1;
    if (i < length) {
      item = array[i];
    }
    return { index, item };
  }

  function skip(relativeIndex = 1) {
    index += relativeIndex;
  }

  function eof() {
    return !(index < length);
  }

  return { read, seek, skip, eof };
}
