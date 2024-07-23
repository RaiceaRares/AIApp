const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { extractExamplesFromLocal } = require("./extractExamples");
const { HuggingFaceInference } = require("@huggingface/inference");
//const { LLMChain } = require("langchain/chains");
const langchain= require('langchain');
require('dotenv').config();

const app = express();
const port = 3000;

const hf = new HuggingFaceInference(process.env.HUGGING_FACE_API_KEY);

async function getLlama3Response(prompt) {
  const response = await hf.textGeneration({
    model: "llama-3",
    inputs: prompt,
  });
  return response.generated_text;
}

const promptTemplate = new PromptTemplate("Question: {question}\nAnswer:");
const chain = new langchain.Chain({
  llm: getLlama3Response,
  prompt: promptTemplate,
});

let examples = [];

async function loadExamples() {
  const filePath = path.join(__dirname, "uploads", "your-file-name.docx");
  examples = await extractExamplesFromLocal(filePath);
}

loadExamples();

app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const inputs = { question };

  try {
    const response = await llamaChain.call(inputs);
    const fullResponse = {
      response,
      examples,
    };
    res.json(fullResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
