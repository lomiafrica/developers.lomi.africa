import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertMetaFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');

    // If the file is already .tsx, skip it
    if (filePath.endsWith('.tsx')) {
        console.log(`× Skipping already converted file: ${filePath}`);
        return;
    }

    // Convert JSON to TypeScript object
    try {
        const jsonContent = JSON.parse(content);
        const tsContent = `
const meta = ${JSON.stringify(jsonContent, null, 2)};
export default meta;
`;
        const newPath = filePath.replace('.json', '.tsx');
        fs.writeFileSync(newPath, tsContent);
        console.log(`✓ Converted ${path.basename(filePath)} to ${path.basename(newPath)}`);
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error(`× Error processing ${filePath}:`, error.message);
    }
}

function findMetaFiles(dir) {
    console.log(`Scanning directory: ${dir}`);
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findMetaFiles(filePath);
        } else if (file === '_meta.json') {
            convertMetaFile(filePath);
        }
    });
}

console.log('Starting meta files conversion...');
const pagesDir = path.join(__dirname, '../src/pages');
console.log(`Looking for meta files in: ${pagesDir}`);
findMetaFiles(pagesDir);
console.log('Conversion process completed.'); 