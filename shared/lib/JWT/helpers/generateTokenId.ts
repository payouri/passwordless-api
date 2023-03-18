import { customAlphabet, urlAlphabet } from "nanoid";

const generate = customAlphabet(urlAlphabet, 32);

export function generateTokenId() {
  return generate();
}
