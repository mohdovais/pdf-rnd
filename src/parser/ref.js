const regex_ref = /(\d+) \d+ R/;

/**
 * Using mutation for memory performance
 * @param {any} subject
 * @param {Array} array
 */
export function replaceWithRef(subject, array) {
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
