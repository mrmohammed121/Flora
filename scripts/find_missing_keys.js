import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translations from '../src/locales/translations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enKeys = new Set(Object.keys(translations.en));

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = scanDir(path.resolve(__dirname, '../src'));
const missingKeysByFile = {};
const regex = /t\(\s*['"]([^'"]+)['"]/g;

for (const file of allFiles) {
  if (file.includes('translations.js') || file.includes('test_')) continue;
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    if (!enKeys.has(key)) {
      if (!missingKeysByFile[file]) missingKeysByFile[file] = new Set();
      missingKeysByFile[file].add(key);
    }
  }
}

console.log('Total files scanned:', allFiles.length);
for (const [f, keys] of Object.entries(missingKeysByFile)) {
  console.log(path.basename(f) + ' -> ' + Array.from(keys).join(', '));
}
