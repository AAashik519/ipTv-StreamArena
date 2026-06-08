const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBuffer, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBuffer, data, crcBuf]);
}

function createIconPNG(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bitDepth=8, colorType=2(RGB), compress=0, filter=0, interlace=0
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.45;
  const innerR = size * 0.25;

  const rowSize = size * 3;
  const raw = Buffer.alloc((rowSize + 1) * size);

  for (let y = 0; y < size; y++) {
    raw[y * (rowSize + 1)] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const off = y * (rowSize + 1) + 1 + x * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= outerR) {
        if (dist <= innerR) {
          // White TV screen area
          raw[off] = 255;
          raw[off + 1] = 255;
          raw[off + 2] = 255;
        } else {
          // Red circle background
          raw[off] = 229;
          raw[off + 1] = 9;
          raw[off + 2] = 20;
        }
      } else {
        // Dark background
        raw[off] = 13;
        raw[off + 1] = 13;
        raw[off + 2] = 15;
      }
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createIconPNG(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createIconPNG(512));

console.log('✅ Icons generated: icon-192.png, icon-512.png');
