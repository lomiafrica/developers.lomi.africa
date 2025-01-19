import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractTextFromMarkdown(markdownContent) {
    const headingRegex = /^#+\s+(.*)/gm;
    const htmlTagRegex = /<[^>]*>/gm;
    const urlRegex = /(https?:\/\/\S+)/gm;
    let plainText = markdownContent.replace(headingRegex, "$1\n");
    plainText = plainText.replace(htmlTagRegex, "");
    plainText = plainText.replace(urlRegex, "");
    return plainText;
}

let parentName = null;

function readAndFlattenDirectory(directoryPath, parentName = null) {
    const files = {};

    const items = fs.readdirSync(directoryPath);

    items.forEach((item) => {
        const itemPath = path.join(directoryPath, item);
        const stats = fs.statSync(itemPath);
        if (
            item === "_meta.json" ||
            item === "_app.mdx" ||
            item === "getting-started.mdx"
        ) {
            return;
        }
        if (stats.isDirectory()) {
            const actualParentName = itemPath.split("pages/").pop().split("/")?.[0];
            const nextParentName =
                parentName === null || actualParentName !== parentName
                    ? actualParentName
                    : parentName;
            const nestedFiles = readAndFlattenDirectory(itemPath, nextParentName);
            Object.assign(files, nestedFiles);
        } else {
            const content = fs.readFileSync(itemPath, "utf-8");
            const filePath = itemPath
                .split("pages/")
                .pop()
                .replace(/\.[^.]+$/, "");
            files[filePath] = {
                name: itemPath
                    .split("/")
                    .pop()
                    .replace(/\.[^.]+$/, ""),
                content: extractTextFromMarkdown(content),
                parentName: parentName,
                path: filePath,
            };
        }
    });

    return files;
}

function initializeFileCache() {
    const directoryPath = path.join(__dirname, "../../src/pages");
    const outputFilePath = path.join(
        __dirname,
        "../../src/lib/cache/fileCache.json"
    );

    const files = readAndFlattenDirectory(directoryPath, parentName);
    writeDataToFile(files, outputFilePath);
}

function writeDataToFile(data, outputFilePath) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(outputFilePath, jsonData);
}

initializeFileCache(); 