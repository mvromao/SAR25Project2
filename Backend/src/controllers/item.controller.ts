import { Request, Response } from 'express';
import Item from '../models/item';

/**
 * Create a new item
 * Note: original dummy functionality
 */
export const createItem = (req: Request, res: Response): void => {
  console.log("NewItem -> received form submission new item");
  console.log(req.body);
  
  // Send dummy response as in the original code
  // TODO: Implement actual logic to create item in the database
  // For now, just log the item details to be created
  res.json({
    description: "somedescription",
    currentbid: "somecurrentbid",
    remainingtime: "someremainingtime",
    wininguser: "somewininguser"
  });
};

/**
 * Remove an existing item
 * Note: original dummy functionality
 */
export const removeItem = (req: Request, res: Response): void => {
  console.log("RemoveItem -> received form submission remove item");
  console.log(req.body);
  

  // TODO: Implement actual logic to remove item from the database
  // For now, just log the item ID to be removed
  // No response was sent in the original code
  res.status(200).end();
};

/**
 * Get all items
 * Note: original dummy functionality
 */
export const getItems = (req: Request, res: Response): void => {
  // Create dummy items 
  const items = [
    {
      description: 'Smartphone',
      currentbid: 250,
      remainingtime: 120,
      buynow: 1000,
      wininguser: 'dummyuser1',
      sold: false,
      owner: 'dummyowner1',
      id: 1
    },
    {
      description: 'Tablet',
      currentbid: 300,
      remainingtime: 120,
      buynow: 940,
      wininguser: 'dummyuser2',
      sold: false,
      owner: 'dummyowner2',
      id: 2
    },
    {
      description: 'Computer',
      currentbid: 120,
      remainingtime: 120,
      buynow: 880,
      wininguser: 'dummyuser3',
      sold: false,
      owner: 'dummyowner3',
      id: 3
    }
  ];
  
  // Send response
  res.json(items);
  console.log("received get Items call responded with: ", items);
};