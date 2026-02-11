import { convertTStoTC } from './utils/convertTStoTC.js';
import path from 'path';
import fs from 'fs';

const inputDir = path.join(process.cwd(), 'BANDING');
const outputDir = path.join(process.cwd(), 'yml-tc');

// Buat direktori output jika belum ada
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

convertTStoTC(inputDir, outputDir);
