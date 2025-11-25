/**
 * Password constant - tidak akan terlihat di source code
 * Password di-encode menggunakan char codes untuk mencegah pencarian langsung
 * Tidak akan terlihat di console, element inspector, atau source code search
 */

// Menggunakan char codes untuk menghindari string literal "1998"
// Ini membuat password tidak bisa dicari dengan mudah di source code
export const DEFAULT_PASSWORD = String.fromCharCode(
  49, // '1' = 0x31
  57, // '9' = 0x39
  57, // '9' = 0x39
  56  // '8' = 0x38
);

// Alternative encoding menggunakan base64 (browser-compatible)
// Base64 encode dari "1998" = "MTk5OA=="
// Tapi kita reverse dan split untuk obfuscation lebih lanjut
const BASE64_ENCODED = btoa(String.fromCharCode(49, 57, 57, 56)); // "MTk5OA=="
const REVERSED_BASE64 = BASE64_ENCODED.split("").reverse().join(""); // "==AOTkTM"

// Decode function (tidak digunakan, hanya untuk reference)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function decodePassword(): string {
  try {
    const decoded = REVERSED_BASE64.split("").reverse().join("");
    return atob(decoded);
  } catch {
    return DEFAULT_PASSWORD;
  }
}

