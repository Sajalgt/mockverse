const { generateSchema } = require('../services/geminiService');

async function handleSchemaGeneration(req, res) {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'userInput is mandatory' });
    }

    const schema = await generateSchema(userInput);

    return res.status(200).json({ schema });
  } catch (error) {
    console.error('Schema generation error:', error.message);
    return res.status(500).json({ error: 'Schema generate karne mein dikkat aayi' });
  }
}

module.exports = { handleSchemaGeneration };