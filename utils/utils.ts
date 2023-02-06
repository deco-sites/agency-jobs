import {
  crypto,
  toHashString,
} from "https://deno.land/std@0.176.0/crypto/mod.ts";

export async function createHashId(title: string, description: string) {
  const textToEncode = `${title}${description}`;
  const hash = await crypto.subtle.digest(
    "MD5",
    new TextEncoder().encode(textToEncode),
  );

  return toHashString(hash);
}
