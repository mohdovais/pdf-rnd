//http://what-when-how.com/itext-5/understanding-the-carousel-object-system-itext-5/

import { createStream } from "./stream.js";
import { Inflate } from "../vendor/zlib.esm.js";
import { date_regex, readDate } from "./reader/date.js";
import { readString } from "./reader/string.js";
import { readDictionary } from "./reader/dictionary.js";
import { readArray } from "./reader/array.js";

const clean_string = str => str.trim().replace(/\s+/g, " ");
const number_safe = subject => (isNaN(subject) ? subject : Number(subject));
const stream_regex = /stream\n([\s\S]+)\nendstream*/;

// unicode missing /uF607
// hexadecimal data enclosed in angle brackets: < > missing
function read(stream) {
  var token = stream.read();

  if (token === "true") {
    return true;
  } else if (token === "false") {
    return false;
  } else if (token === "<<") {
    // Dictinary << A B >>
    let x = readDictionary(stream, {});
    return x;
  } else if (/^\/[A-Z0-9]/.test(token)) {
    // /Name
    return token.substr(1);
  } else if (!isNaN(token)) {
    // Number or Reference
    let a = stream.seek(1).item;
    let b = stream.seek(2).item;
    if (!isNaN(a) && b === "R") {
      stream.skip(2);
      return `${token} ${a} ${b}`;
    }
    return Number(token);
  } else if (token.charAt(0) === "[") {
    // Array
    let firstElement = token.substr(1);
    return readArray(
      stream,
      firstElement === "" ? [] : [number_safe(firstElement)]
    );
  } else if (date_regex.test(token)) {
    return readDate(token);
  } else if (token.charAt(0) === "(") {
    //====================
    // String
    let exec;
    if ((exec = /^\((.*)\)$/.exec(token))) {
      return exec[1];
    } else {
      let firstElement = token.substr(1);
      return readString(stream, firstElement === "" ? [] : [firstElement]);
    }
  }

  return token;
}

function stringUint8Array(str) {
  var length = str.length;
  var bytes = new Uint8Array(length);
  for (var i = 0; i < length; i++) {
    var asciiCode = str.charCodeAt(i);
    bytes[i] = asciiCode;
  }
  return bytes;
}

export function parseCOS(str) {
  var hasStream = stream_regex.test(str);
  var root = [];

  // extract `stream` text
  var stringStream = null;
  if (hasStream) {
    str = str.replace(stream_regex, function(a, b) {
      stringStream = b;
      return "";
    });
  }

  // convert COS to JSON without stream
  var array_stream = createStream(clean_string(str).split(" "));
  while (!array_stream.eof()) {
    let x = read(array_stream);
    root.push(x);
  }

  if (hasStream) {
    let compressed = stringUint8Array(stringStream);
    let inflate = new Inflate(compressed);
    let plain = inflate.decompress();
    let flatStream = Array.prototype.map
      .call(plain, x => String.fromCharCode(x))
      .join("");

    if (root.length === 1) {
      root[0].stream = flatStream;
    } else {
      root.push(flatStream);
    }
  }

  return root.length === 1 ? root[0] : root;
}
