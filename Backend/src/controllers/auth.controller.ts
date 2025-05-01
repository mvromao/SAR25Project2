import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../config/config';

/**
 * Handle user authentication
 * Note: Maintaining original dummy functionality
 */
export const authenticate = (req: Request, res: Response): void => {
  console.log('Authenticate -> Received Authentication POST');
  
  // Generate JWT token
  const token = jwt.sign(req.body, config.jwtSecret);
  
  // Send response with token
  res.json({
    username: req.body.username,
    token
  });
  
  console.log('Authenticate -> Received Authentication POST');
};

/**
 * Handle user registration
 * Note: Maintaining original dummy functionality
 */
export const registerUser = (req: Request, res: Response): void => {
  console.log("NewUser -> received form submission new user");
  console.log(req.body);
  
  // Send dummy response as in the original code
  res.json({
    name: "somename",
    email: "some@somemail.com",
    username: "someusername",
    password: "somepassword",
    latitude: 19.09,
    longitude: 34
  });
};

/**
 * Get all users
 * Note: Maintaining original dummy functionality
 */
export const getUsers = (req: Request, res: Response): void => {
  // Original functionality just returned OK
  res.status(200).send('OK');
};