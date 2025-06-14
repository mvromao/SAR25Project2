import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../config/config';
import { read } from 'fs';

/**
 * Handle user authentication
 * Note: Original dummy functionality
 */
export const authenticate = (req: Request, res: Response): void => {
  console.log('Authenticate -> Received Authentication POST');
  
  // Generate JWT token youshould use a real user authentication here check in the database
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      // Compare password with the hashed password in the database
      if (req.body.password !== user.password) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      // If user is found and password is correct, generate a token
      const token = jwt.sign({ username: user.username }, config.jwtSecret, {
        expiresIn: '1h' // Token expiration time
      });
      res.json({
        username: user.username,
        token
      });
    })
    .catch((err) => {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'Internal server error' });
    });
  
  
  
  // // For now, we are just signing the request body
  // const token = jwt.sign(req.body, config.jwtSecret);
  
  // // Send response with token
  // res.json({
  //   username: req.body.username,
  //   token
  // });
  
  // console.log('Authenticate -> Received Authentication POST');
};

/**
 * Handle user registration
 * Note: Original dummy functionality
 */
export const registerUser = (req: Request, res: Response): void => {
  console.log("NewUser -> received form submission new user");
  console.log(req.body);
  
  // Send dummy response with user data
  // In the  implementation, you have to save the user to the database
  User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  })
  res.json({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
};

/**
 * Get all users
 * Note: Maintaining original dummy functionality
 */
export const getUsers = (req: Request, res: Response): void => {
  // Go to the database and get all users
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Internal server error' });
    });

  //  For now it just returs OK
  //res.status(200).send('OK');
};