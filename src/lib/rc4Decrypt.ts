class RC4Decrypt {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  decrypt(ciphertext: string) {
    const str = this.hexToBinary(ciphertext);
    return this.rc4(this.key, str);
  }

  rc4(key: string, str: string) {
    const s = Array.from({ length: 256 }, (_, i) => i);
    let j = 0;
    const keyLength = key.length;

    for (let i = 0; i < 256; i++) {
      j = (j + s[i]! + key.charCodeAt(i % keyLength)) % 256;
      [s[i]!, s[j]!] = [s[j]!, s[i]!];
    }

    let i = 0;
    j = 0;
    let result = "";

    for (let y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]!) % 256;
      [s[i]!, s[j]!] = [s[j]!, s[i]!];
      const k = s[(s[i]! + s[j]!) % 256];
      result += String.fromCharCode(str.charCodeAt(y) ^ k!);
    }

    return result;
  }

  hexToBinary(hex: string) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return String.fromCharCode(...bytes);
  }
}

export default RC4Decrypt;
