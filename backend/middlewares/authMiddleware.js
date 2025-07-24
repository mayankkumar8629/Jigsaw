import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config({ path: '../.env' });

export const authenticateToken =async (req, res, next) => {
    // Extract token from the Authorization header (format: "Bearer <token>")
   
    const authHeader = await req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    console.log(process.env.ACCESS_TOKEN_SECRET);
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      // Attach the decoded token (user info) to req.user
      req.user = user;
      console.log("successfull");
      next();
    });
};