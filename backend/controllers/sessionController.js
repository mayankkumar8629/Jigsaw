import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config({path:'../.env'});

export const createNewSession = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.userId;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required and must be a string',
      });
    }

    // Initialize session with EMPTY history (no initial entry)
    const session = new Session({
      userId,
      title: generateTitle(prompt),
      currentState: '', // Will update after API call
      history: [], // Start empty
    });

    // Call API and process response
    const rawRes = await callOpenRouterAPI(prompt);
    const cleanRes = rawRes.replace(/\n/g, '');

    const code = extractCode(rawRes);
    const cleanCode = code.replace(/\n/g, '');

    console.log("Code extracted:", cleanCode);
    console.log("Response from AI:", cleanRes);

    // Update session with the FIRST history entry (no duplicates)
    session.currentState = cleanCode;
    session.history.push({
      prompt,
      response: cleanRes, // Ensure field names match schema
      code: cleanCode,
    });

    await session.save();

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        response: cleanRes,
        code: cleanCode,
        title: session.title,
      },
    });

  } catch (err) {
    console.error('Error creating new session:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

//calling the api 
const callOpenRouterAPI = async (prompt) => {
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
//calling the api for refining the component
const callOpenRouter = async (messages) => {
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
//genearte title from the prompt
const generateTitle = (prompt) => {
  return prompt.split(' ').slice(0, 3).join(' ') + (prompt.split(' ').length > 3 ? '...' : '');
};

//extract code from the response
 
export const extractCode = (gptResponse) => {
  // 1. Handle empty responses
  if (!gptResponse) return '';

  // 2. Extract the last code block (most likely the actual code)
  const codeBlocks = gptResponse.match(/```(?:[a-z]*\n)?([\s\S]+?)```/gi);
  if (codeBlocks) {
    const lastBlock = codeBlocks[codeBlocks.length - 1];
    return lastBlock.replace(/```.*\n?|\```/g, '').trim();
  }

  // 3. Fallback: Extract content between markers (e.g., /////)
  const markerMatch = gptResponse.match(/(\/{5,}|={5,})([\s\S]+?)(\/{5,}|={5,})/);
  if (markerMatch) return markerMatch[2].trim();

  // 4. Ultimate fallback: Return everything (assume it's pure code)
  return gptResponse.trim();
};
///refifing the component
export const refineComponent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // 1. Validate input
    if (!prompt?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Prompt cannot be empty' 
      });
    }

    // 2. Load session
    const session = await Session.findOne({
      _id: sessionId,
      userId 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or access denied'
      });
    }

    // 3. Prepare context messages - FIXED VERSION
    const contextMessages = [
      {
        role: "system",
        content: "Modify this React component. Return ONLY code between ```jsx``` blocks."
      }
    ];

    // Add history messages (ensuring no undefined/empty values)
    session.history.slice(-3).forEach(msg => {
      if (msg.prompt) {
        contextMessages.push({
          role: "user",
          content: msg.prompt
        });
      }
      if (msg.code || msg.response) {
        contextMessages.push({
          role: "assistant",
          content: msg.code || msg.response
        });
      }
    });

    // Add current prompt
    contextMessages.push({
      role: "user",
      content: prompt
    });

    console.log("Final messages:", JSON.stringify(contextMessages, null, 2));

    // 4. Call AI
    const rawResponse = await callOpenRouter(contextMessages); // Pass array directly
    const cleanResponse = rawResponse.replace(/\n/g, '');
    const pureCode = extractCode(rawResponse);
    const cleanCode = pureCode.replace(/\n/g, '');

    // 5. Update session
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        $set: { 
          currentState: cleanCode
        },
        $push: {
          history: {
            prompt,
            response: cleanResponse,
            code: cleanCode
          }
        }
      },
      { new: true }
    );

    // 6. Respond
    res.json({
      success: true,
      data: {
        code: cleanCode,
        sessionId: updatedSession._id,
        history: updatedSession.history.slice(-3)
      }
    });

  } catch (error) {
    console.error('Refinement Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
