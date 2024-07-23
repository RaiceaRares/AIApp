const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

async function readFile(filePath) {
  return fs.promises.readFile(filePath);
}

async function extractExamplesFromLocal(filePath) {
  try {
    const fileBuffer = await readFile(filePath);
    const { value: text } = await mammoth.extractRawText({
      buffer: fileBuffer,
    });
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
  } catch (error) {
    console.error("Error extracting examples:", error);
  }
}

module.exports = {
  extractExamplesFromLocal,
};
