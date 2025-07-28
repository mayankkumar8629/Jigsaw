import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
import { callOpenRouterAPI,callOpenRouter } from "../service/openRouterService.js";
import { generateTitle,extractCode } from "../utils/sessionUtil.js";


//creating new session
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

    
    const session = new Session({
      userId,
      title: generateTitle(prompt),
      currentState: '', 
      history: [], 
    });

    // Call API and process response
    const rawRes = await callOpenRouterAPI(prompt);
    const cleanRes = rawRes.replace(/\n/g, '');

    const code = extractCode(rawRes);
    const cleanCode = code.replace(/\n/g, '');

    console.log("Code extracted:", cleanCode);
    console.log("Response from AI:", cleanRes);

  
    session.currentState = cleanCode;
    session.history.push({
      prompt,
      response: cleanRes, 
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

//refininng the component

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

    
    const contextMessages = [
      {
        role: "system",
        content: "Modify this React component. Return ONLY code between ```jsx``` blocks."
      }
    ];

    // Add history messages 
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

    // Calling AI
    const rawResponse = await callOpenRouter(contextMessages); 
    const cleanResponse = rawResponse.replace(/\n/g, '');
    const pureCode = extractCode(rawResponse);
    const cleanCode = pureCode.replace(/\n/g, '');

    // Update session
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

export const getAllSessions = async (req, res) => {
  try {
    console.log('req coming');
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    
    const sessions = await Session.find({ userId })
      .select('title createdAt _id')  
      .sort({ createdAt: -1 })
      .lean();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({
        message: "No sessions found"
      });
    }

    return res.status(200).json({
      message: "Sessions fetched successfully",
      sessions
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    
    if (!sessionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid session ID format"
      });
    }

    
    const session = await Session.findOne({ 
      _id: sessionId, 
      userId: userId 
    }).lean();

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    return res.status(200).json({
      message: "Session fetched successfully",
      session
    });

  } catch (error) {
    console.error('Error fetching session by ID:', error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};