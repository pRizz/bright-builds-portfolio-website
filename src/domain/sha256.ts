const initialHashValues = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
] as const;

const roundConstants = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

export function sha256Hex(input: string): string {
  const messageBytes = new TextEncoder().encode(input);
  const bitLength = messageBytes.length * 8;
  const paddedLength = Math.ceil((messageBytes.length + 9) / 64) * 64;
  const paddedBytes = new Uint8Array(paddedLength);
  const words = new Uint32Array(64);
  const hash: number[] = [...initialHashValues];

  paddedBytes.set(messageBytes);
  paddedBytes[messageBytes.length] = 0x80;

  for (let index = 0; index < 8; index += 1) {
    paddedBytes[paddedLength - 1 - index] = (bitLength / 2 ** (8 * index)) & 0xff;
  }

  for (let chunkOffset = 0; chunkOffset < paddedBytes.length; chunkOffset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const byteOffset = chunkOffset + index * 4;
      words[index] =
        ((paddedBytes[byteOffset] ?? 0) << 24) |
        ((paddedBytes[byteOffset + 1] ?? 0) << 16) |
        ((paddedBytes[byteOffset + 2] ?? 0) << 8) |
        (paddedBytes[byteOffset + 3] ?? 0);
    }

    for (let index = 16; index < 64; index += 1) {
      const smallSigma0 =
        rotateRight(words[index - 15] ?? 0, 7) ^
        rotateRight(words[index - 15] ?? 0, 18) ^
        ((words[index - 15] ?? 0) >>> 3);
      const smallSigma1 =
        rotateRight(words[index - 2] ?? 0, 17) ^
        rotateRight(words[index - 2] ?? 0, 19) ^
        ((words[index - 2] ?? 0) >>> 10);

      words[index] =
        ((words[index - 16] ?? 0) + smallSigma0 + (words[index - 7] ?? 0) + smallSigma1) >>> 0;
    }

    compressChunk(hash, words);
  }

  return hash.map((value) => value.toString(16).padStart(8, "0")).join("");
}

function compressChunk(hash: number[], words: Uint32Array): void {
  const workingHash: number[] = [...hash];

  for (let index = 0; index < 64; index += 1) {
    const bigSigma1 =
      rotateRight(workingHash[4] ?? 0, 6) ^
      rotateRight(workingHash[4] ?? 0, 11) ^
      rotateRight(workingHash[4] ?? 0, 25);
    const choice =
      ((workingHash[4] ?? 0) & (workingHash[5] ?? 0)) ^
      (~(workingHash[4] ?? 0) & (workingHash[6] ?? 0));
    const temp1 =
      ((workingHash[7] ?? 0) +
        bigSigma1 +
        choice +
        (roundConstants[index] ?? 0) +
        (words[index] ?? 0)) >>>
      0;
    const bigSigma0 =
      rotateRight(workingHash[0] ?? 0, 2) ^
      rotateRight(workingHash[0] ?? 0, 13) ^
      rotateRight(workingHash[0] ?? 0, 22);
    const majority =
      ((workingHash[0] ?? 0) & (workingHash[1] ?? 0)) ^
      ((workingHash[0] ?? 0) & (workingHash[2] ?? 0)) ^
      ((workingHash[1] ?? 0) & (workingHash[2] ?? 0));
    const temp2 = (bigSigma0 + majority) >>> 0;

    workingHash[7] = workingHash[6] ?? 0;
    workingHash[6] = workingHash[5] ?? 0;
    workingHash[5] = workingHash[4] ?? 0;
    workingHash[4] = ((workingHash[3] ?? 0) + temp1) >>> 0;
    workingHash[3] = workingHash[2] ?? 0;
    workingHash[2] = workingHash[1] ?? 0;
    workingHash[1] = workingHash[0] ?? 0;
    workingHash[0] = (temp1 + temp2) >>> 0;
  }

  for (let index = 0; index < hash.length; index += 1) {
    hash[index] = ((hash[index] ?? 0) + (workingHash[index] ?? 0)) >>> 0;
  }
}

function rotateRight(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}
