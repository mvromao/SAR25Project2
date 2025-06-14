import { Request, Response } from 'express';
import Item from '../models/item';

import SocketService from '../services/socket.service';
/**
 * Create a new item
 * Note: original dummy functionality
 */
export const createItem = (req: Request, res: Response): void => {
  console.log("NewItem -> received form submission new item");
  console.log(req.body);

  // Create a new item in the database
  Item.create({
    description: req.body.description,
    currentbid: req.body.currentbid,
    remainingtime: req.body.remainingtime,
    dateEnd: req.body.dateEnd,
    buynow: req.body.buynow,
    wininguser: req.body.wininguser,
    owner: req.body.owner
  });
  res.status(200).end();
};

/**
 * Remove an existing item
 * Note: original dummy functionality
 */
export const removeItem = async (req: Request, res: Response): Promise<void> => {
  console.log("RemoveItem -> received form submission remove item");
  console.log(req.body);
  
  Item.findByIdAndDelete(req.body._id)
    .then((result) => {
      if(result){
        console.log("Item removed successfully:", result.description);
        res.status(200).json({ message: 'Item removed successfully' });
      } else {
        console.log("Item not found with name:", req.body.description);
        res.status(404).json({ message: 'Item not found' });
      }
    });
};


export const getItems = async (req: Request, res: Response): Promise<void> => {
  Item.find()
    .then((items) => {
      // Send response
      res.json(items);
      console.log("= Received getItems call, responded with: ", items);
    })
    .catch((err) => {
      console.error('Error fetching items:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
};