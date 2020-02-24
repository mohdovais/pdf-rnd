import { read } from "../stream.js";

export function readDictionary(stream, dictionary) {
  var token = read(stream);
  while (token !== ">>") {
    dictionary[token] = read(stream);
    token = read(stream);
  }
  return dictionary;
}
