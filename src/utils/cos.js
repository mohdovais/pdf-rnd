//http://what-when-how.com/itext-5/understanding-the-carousel-object-system-itext-5/

const clean_string = str => str.trim().replace(/\s+/g, " ");

const number_safe = subject => (isNaN(subject) ? subject : Number(subject));

const date_regex = /\(D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?([-+Z])(\d{2})'(\d{2})'\)/;

/**
 *
 * @param {Array} array
 */
function createStream(array) {
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

  function skip(relativeIndex) {
    index += relativeIndex;
  }

  function eof() {
    return !(index < length);
  }

  return { read, seek, skip, eof };
}

function readDictionary(stream, dictionary) {
  var token = read(stream);
  while (token !== ">>") {
    dictionary[token] = read(stream);
    token = read(stream);
  }
  return dictionary;
}

/**
 * @param {Object} stream
 * @param {Array} array
 * @returns {Array}
 */
function readArray(stream, array) {
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

function readString(stream, array) {
  var token = read(stream);
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

/**
 * 0: "(D:20200217202038Z00'00')"
 */
function readDate(str) {
  const d = date_regex.exec(str);
  return (
    d[1] +
    "-" +
    (d[2] || "00") +
    "-" +
    (d[3] || "00") +
    "T" +
    (d[4] || "00") +
    ":" +
    (d[5] || "00") +
    ":" +
    (d[6] || "00") +
    ".000" +
    (d[7] === "Z" ? "Z" : d[7] + (d[8] || "00") + ":" + (d[9] || "00"))
  );
}

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
    var ascii = str.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

export function parseCOS(str) {
  var stream_regex = /stream\n([\s\S]+)\nendstream*/;
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
    let inflate = new Zlib.Inflate(compressed);
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
