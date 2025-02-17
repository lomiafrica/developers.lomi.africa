import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readMetaFile(directoryPath) {
    const metaPath = path.join(directoryPath, "_meta.json");
    if (fs.existsSync(metaPath)) {
        const metaContent = fs.readFileSync(metaPath, "utf-8");
        return JSON.parse(metaContent);
    }
    return {};
}

function isDirectory(directoryPath) {
    const metaPath = path.join(directoryPath, "_meta.json");
    return fs.existsSync(metaPath) && fs.statSync(metaPath).isFile();
}

function buildIndexCache(directoryPath, relativePath = "") {
    const indexCache = [];
    if (!fs.existsSync(directoryPath)) {
        return indexCache;
    }

    const meta = readMetaFile(directoryPath);
    Object.entries(meta).forEach(([itemName, itemDisplayName]) => {
        const itemPath = path.join(directoryPath, itemName);
        if (isDirectory(itemPath)) {
            const children = buildIndexCache(
                itemPath,
                path.join(relativePath, itemName)
            );
            indexCache.push({
                name: itemDisplayName,
                children: children,
            });
        } else {
            const fileName = path.basename(itemName, path.extname(itemName));
            if (fileName === "_meta" || fileName === "_app") return;
            indexCache.push({
                name: itemDisplayName,
                path: path.join(relativePath, fileName === "index" ? "" : fileName),
            });
        }
    });

    return indexCache;
}

function initializeIndexCache() {
    const directoryPath = path.join(__dirname, "../../src/pages");
    const outputFilePath = path.join(
        __dirname,
        "../../src/lib/cache/indexCache.json"
    );

    const indexCache = buildIndexCache(directoryPath);
    writeDataToFile(indexCache, outputFilePath);
}

function writeDataToFile(data, outputFilePath) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(outputFilePath, jsonData);
}

initializeIndexCache(); 