import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

//calling the API for the new session
export const callOpenRouterAPI = async (prompt) => {
  console.log("Calling OpenRouter API with prompt:", prompt);
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.SITE_URL || "www.github.com",
      "X-Title": process.env.APP_NAME || "Component Generator",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Jigsaw, a React component generator. STRICTLY follow this format:

1. IMPORTS (MUST include):
\`\`\`jsx
import React from 'react';
import { useState, useEffect } from 'react';
\`\`\`

2. COMPONENT RULES:
- Use named functions (no arrow functions)
- Use destructured hooks (useState, useEffect)
- Export default at bottom
- Use Tailwind classes
- Include accessibility attributes

EXAMPLE OUTPUT:
\`\`\`jsx
import React from 'react';
import { useState } from 'react';

function PrimaryButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <button
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
               disabled:opacity-50 transition-all"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Submit'}
    </button>
  );
}

export default PrimaryButton;
\`\`\`

Make components functional, interactive, and visually appealing with proper event handlers and responsive design.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    })
  });
  
  console.log(response);

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
   
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array must contain at least one message');
    }

    const payload = {
      model: "openai/gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content || "" 
      })),
      temperature: 0.7
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2)); 

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