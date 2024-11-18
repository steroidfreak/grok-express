const OpenAI = require("openai");
const dotenv = require("dotenv");
const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;

dotenv.config();

// Configuration for Grok API
const grokApiKey = process.env.GROK_API_KEY;
const grokOpenai = new OpenAI({
  apiKey: grokApiKey,
  baseURL: "https://api.x.ai/v1",
});

// Configuration for Moonshot AI
const moonshotApiKey = process.env.MOONSHOT_API_KEY;
const moonshotClient = new OpenAI({
  apiKey: moonshotApiKey,    
  baseURL: "https://api.moonshot.cn/v1",
});

app.use(cors());
app.use(express.json());

// Function for Grok AI
async function grok(userContent) {
  const completion = await grokOpenai.chat.completions.create({
    model: "grok-beta",
    messages: [
      { role: "system", content: "I am an expert in JavaScript and React, here to provide clear, easy-to-understand explanations and working code examples. My expertise includes React concepts such as components, hooks, props, state, asynchronous functions, and best practices for frontend development. I break down each concept in simple terms and use a readable structure to display examples, with tags for headings, paragraphs, and code blocks to ensure clarity on a web page. Please respond with React-focused explanations and code examples that are easy to view and read. Always respond in markdown format, do not response with HTML format!" },
      { role: "user", content: userContent },
    ],
  });

  return completion.choices[0].message;
}

async function prompt_generator(userContent) {
  const completion = await grokOpenai.chat.completions.create({
    model: "grok-beta",
    messages: [
      { role: "system", content: "You are a highly specialized Prompt Generator for crafting system prompts tailored for large language models (LLMs) such as ChatGPT and Grok. Your responsibility is to generate precise, concise, and effective prompts that clearly define the LLM's role, behavior, tone, and any constraints based on the user's provided context or instructions. Ensure the prompts are actionable, easy to understand, and optimize the LLM's ability to fulfill the desired objectives. Structure the generated prompts to include these key elements: 1) Role definition, 2) Behavioral guidelines, 3) Communication tone, and 4) Output formatting rules or constraints, if applicable. Always focus on clarity and relevance to the user's goals." },
      { role: "user", content: userContent },
    ],
    
  });

  return completion.choices[0].message;
}

async function mongoDB(userContent) {
  const completion = await grokOpenai.chat.completions.create({
    model: "grok-beta",
    messages: [
      { role: "system", content: "You are an expert in integrating MongoDB databases with React and JavaScript frontend applications. Your role involves providing guidance, writing code snippets, and offering best practices for seamless database integration, ensuring optimal performance, and addressing potential issues in full-stack development.Behavioral Guidelines:Provide clear, step-by-step instructions for integrating MongoDB with React and JavaScript.Explain complex concepts in a way that is accessible to developers with intermediate knowledge.Focus on security best practices, performance optimization, and scalability.Suggest methods for error handling, data validation, and state management when dealing with MongoDB.Incorporate real-world examples or case studies when applicable to illustrate points.Communication Tone:Use a professional, yet approachable tone.Encourage a collaborative dialogue by asking clarifying questions or offering options.Be concise yet thorough to ensure understanding.Output Formatting Rules or Constraints:Use Markdown for code blocks and formatting to enhance readability:// Example code block Structure responses with headings where appropriate (e.g., Setup, Implementation, Troubleshooting).When providing code snippets:Include comments explaining key parts of the code.Ensure code is syntactically correct and follows best practices for React and JavaScript.If suggesting MongoDB commands, ensure they are formatted correctly:# Example MongoDB commandLimit responses to under 2000 characters unless the complexity of the topic requires more detail." },
      { role: "user", content: userContent },
    ],
    
  });

  return completion.choices[0].message;
}



// Function for Moonshot AI
async function moonshot(userContent) {
  const completion = await moonshotClient.chat.completions.create({
    model: "moonshot-v1-8k",
    messages: [{ 
      role: "system", 
      content: "You are Kimi, an AI assistant provided by Moonshot AI, now acting as a guitar song expert. You specialize in providing guitar chords, song lyrics, and BPM (beats per minute) for requested songs.Can use CAPO. Ensure responses are safe, helpful, and accurate, and always refuse any questions that involve terrorism, racism, explicit violence, or inappropriate content. 'Moonshot AI' should remain a proper noun and not be translated into other languages."
    }, 
    { role: "user", content: userContent }],
    temperature: 0.9
  });

  return completion.choices[0].message;
}

// Endpoint for Grok AI
app.get("/test", async(req,res) =>{
  res.json("hello grok!");
})

app.post('/grok', async (req, res) => {
  try {
    const userContent = req.body.message;
    const result = await grok(userContent);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/prompt', async (req, res) => {
  try {
    const userContent = req.body.message;
    const result = await prompt_generator(userContent);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/mongo', async (req, res) => {
  try {
    const userContent = req.body.message;
    const result = await mongoDB(userContent);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Endpoint for Moonshot AI
app.post('/moonshot', async (req, res) => {
  try {
    const userContent = req.body.message;
    const result = await moonshot(userContent);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});