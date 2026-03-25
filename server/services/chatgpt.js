require("dotenv").config();

const axios = require("axios");

const chatgpt = async (prompt) => {
  console.log("ChatGPT prompt:", prompt);
  console.log("ChatGPT API URL:", process.env.CHATGPT_API_URL);
  console.log("ChatGPT Model:", process.env.CHATGPT_MODEL);
  console.log(
    "ChatGPT API Key:",
    process.env.CHATGPT_API_KEY ? "Present" : "Missing",
  );

  try {
    const response = await axios.post(
      process.env.CHATGPT_API_URL,
      {
        model: process.env.CHATGPT_MODEL,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message;
  } catch (error) {
    //console.log("Error calling ChatGPT API:", error);
    console.log("Error calling ChatGPT API:", {
      message: error.message,
      responseData: error.response ? error.response.data : null,
    });
  }
};

module.exports = { chatgpt };
