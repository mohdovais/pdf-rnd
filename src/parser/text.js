import { createStream } from "./stream.js";

export function parseText(content) {
  const stream = createStream(content);
  var char;
  var begin = false;
  var str = "";

  while ((char = stream.read())) {
    if (char === "(" && stream.seek(-1) !== "\\") {
      begin = true;
      continue;
    }

    if (begin) {
      if (char === ")" && stream.seek(-1).item !== "\\") {
        begin = false;
      } else {
        let future = stream.seek().item;
        if (char === "\\" && (future === ")" || future === "(")) {
          str += future;
          stream.skip();
        } else {
          str += char;
        }
      }
    } else if (char === "E" && stream.seek().item === "T") {
      str += "\n";
    }
  }

  return str;
}
