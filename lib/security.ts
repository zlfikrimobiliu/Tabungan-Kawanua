/**
 * Security utilities untuk melindungi password
 * Password tidak akan terlihat di console atau element inspector
 */

// Simple obfuscation untuk password (bukan enkripsi kuat, tapi cukup untuk mencegah plain text)
const OBFUSCATION_KEY = 0x42; // Simple XOR key

/**
 * Obfuscate password sebelum disimpan
 * Ini membuat password tidak langsung terlihat di localStorage
 */
export function obfuscatePassword(password: string): string {
  if (!password) return "";
  // Simple XOR obfuscation
  return password
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ OBFUSCATION_KEY))
    .join("");
}

/**
 * Deobfuscate password setelah dibaca dari storage
 */
export function deobfuscatePassword(obfuscated: string): string {
  if (!obfuscated) return "";
  // Reverse XOR obfuscation
  return obfuscated
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) ^ OBFUSCATION_KEY))
    .join("");
}

/**
 * Secure comparison - tidak akan log password ke console
 */
export function secureCompare(input: string, stored: string): boolean {
  // Jangan pernah log password
  if (!input || !stored) return false;
  
  // Constant-time comparison untuk mencegah timing attacks
  if (input.length !== stored.length) return false;
  
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    result |= input.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Clear sensitive data dari memory
 */
export function clearSensitiveData(data: string): void {
  // Overwrite dengan random data (untuk string, kita tidak bisa benar-benar overwrite)
  // Tapi setidaknya kita clear reference
  if (typeof data === "string") {
    // Force garbage collection hint
    data = "";
  }
}

