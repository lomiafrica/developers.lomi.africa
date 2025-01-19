import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifyMetaFiles(dir) {
    console.log(`Scanning directory: ${dir}`);
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            verifyMetaFiles(filePath);
        } else if (file.startsWith('_meta.')) {
            if (!file.endsWith('.tsx')) {
                console.error(`❌ Invalid meta file format: ${filePath}`);
                console.error('Meta files should use .tsx extension');
            } else {
                console.log(`✓ Valid meta file: ${filePath}`);
            }
        }
    });
}

console.log('Verifying meta files...');
const pagesDir = path.join(__dirname, '../src/pages');
verifyMetaFiles(pagesDir); 