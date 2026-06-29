const { generateSchema } = require('../services/geminiService');

async function handleSchemaGeneration(req, res) {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'userInput zaroori hai' });
    }

    const schema = await generateSchema(userInput);
    return res.status(200).json({ schema });

  } catch (error) {
    console.error('Schema generation error:', error.message);

    if (error.message === 'INVALID_INPUT') {
      return res.status(400).json({
        error: 'Please provide a meaningful description (e.g. "I need 100 users with name and email").'
      });
    }

    return res.status(500).json({ error: 'Schema generation failed. Please try again.' });
  }
}

module.exports = { handleSchemaGeneration };