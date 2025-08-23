// In authMiddleware.js
import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";


declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
  
      return res.status(403).json({ message: "Forbidden: Token is not valid" });
    }

  
    req.user = user;

  
    next();
  });
}
