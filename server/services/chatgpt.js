require('dotenv').config({ path: __dirname + '/../.env' });
const axios = require('axios');

const chatgpt = async (prompt) => {
  try {
    const response = await axios.post(
      process.env.CHATGPT_API_URL,
      {
        model: process.env.CHATGPT_MODEL,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message;
  } catch (error) {
    console.error('Error calling ChatGPT API:', {
      message: error.message,
      responseData: error.response?.data || null,
    });

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        'ChatGPT API request failed',
    );
  }
};

module.exports = { chatgpt };
