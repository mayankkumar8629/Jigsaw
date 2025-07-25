import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

//calling the API for the new session
export const callOpenRouterAPI = async (prompt) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.SITE_URL || "www.github.com",
      "X-Title": process.env.APP_NAME || "Component Generator",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content: "You are a React component generator. Return code in ```jsx``` blocks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

////calling the API for refining the component
export const callOpenRouter = async (messages) => {
  try {
    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array must contain at least one message');
    }

    const payload = {
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content || "" // Ensure content exists
      })),
      temperature: 0.7
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2)); // Debug log

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "www.github.com",
        "X-Title": process.env.APP_NAME || "Component Generator",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter Error:', errorData);
      throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};