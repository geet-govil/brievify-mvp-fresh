export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, schema } = req.body; // Schema is not directly used by OpenAI's text generation, but we'll keep it in the request body for consistency if needed elsewhere.

    const openAIApiKey = process.env.OPENAI_API_KEY; // Get API key from environment variables

    if (!openAIApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured.' });
    }

    // OpenAI API endpoint and model
    const openAIApiUrl = 'https://api.openai.com/v1/chat/completions';
    const model = 'gpt-3.5-turbo'; // You can change this to 'gpt-4' or other models if you have access

    // Construct OpenAI payload
    const openAIPayload = {
      model: model,
      messages: [{ role: "user", content: prompt }],
      // If you needed structured output, you'd typically guide the model in the prompt
      // and then parse its text response. OpenAI's native structured output is newer
      // and would require different schema handling. For now, we'll rely on prompt guidance.
    };

    try {
      const response = await fetch(openAIApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}` // Authorization header for OpenAI
        },
        body: JSON.stringify(openAIPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error calling OpenAI API:', errorData);
        throw new Error(`OpenAI API error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();

      if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
        const text = result.choices[0].message.content;
        res.status(200).json({ text });
      } else {
        res.status(500).json({ error: 'Unexpected OpenAI API response structure', details: result });
      }
    } catch (error) {
      console.error('Failed to generate content from OpenAI:', error);
      res.status(500).json({ error: 'Failed to generate content from AI.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

