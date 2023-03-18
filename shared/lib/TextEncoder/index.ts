import { TextEncoder } from "util";

export function getTextEncoder() {
  if (global.TextEncoder) {
    return new global.TextEncoder();
  }
  return new TextEncoder();
}
