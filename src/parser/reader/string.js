export function readString(stream, array) {
  var token = stream.read();
  var proceed = true;

  while (proceed) {
    let exec = /(.*)\)$/.exec(token);
    if (exec === null) {
      array.push(token);
      token = stream.read();
    } else {
      if (exec[1] !== "") {
        array.push(exec[1]);
      }
      proceed = false;
    }
  }

  return array.join(" ");
}
