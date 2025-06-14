import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/user';
import item from '../models/item';

class SocketService {
  private io: Server | null = null;
  private socketIDbyUsername: Map<string, string> = new Map();
  private usernamebySocketID: Map<string, string> = new Map();
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Initialize Socket.IO server
   */
  public init(io: Server): void {
    this.io = io;
    
    // JWT authentication for socket.io
    io.use((socket: Socket, next) => {
      // Check for token in query or auth object (supporting both methods)
      const token = 
        socket.handshake.query?.token as string || 
        (socket.handshake.auth as any)?.token;
        
      if (token) {
        jwt.verify(token, config.jwtSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err) {
            console.error('Socket auth error:', err.message);
            return next(new Error('Authentication error'));
          }
          socket.data.decoded_token = decoded;
          next();
        });
      } else {
        console.error('Socket auth error: No token provided');
        next(new Error('Authentication error: No token provided'));
      }
    });

    console.log('Socket service initialized');
    this.setupSocketEvents();
    this.startAuctionTimer();
  }

  /**
   * Set up socket event handlers
   */
  private setupSocketEvents(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const username = socket.data.decoded_token.username;
      console.log(`${username} user connected`);
      
      // Store client in the maps
      this.socketIDbyUsername.set(username, socket.id);
      this.usernamebySocketID.set(socket.id, username);

      // Handle new user event
      socket.on('newUser:username', (data) => {
        console.log("newUser:username -> New user event received: ", data);
        this.newLoggedUserBroadcast(username);
        // Store new username in database
        
      });

      // Handle bid event
      socket.on('send:bid', (data) => {
        console.log("send:bid -> Received event send:bid with data = ", data);
        
        item.findById(data.item._id)
          .then((itemData) => {
            if (itemData) {
              itemData.currentbid = data.bid;
              itemData.wininguser = data.user;

              // Small delay to show the item was sold
              if(data.bid == itemData.buynow) {
                itemData.remainingtime = 5;
              }

              itemData.save()
                .then(async() => {
                  if(data.bid == itemData.buynow){
                    console.log("Buy now price met, item sold immediately");
                    this.io?.emit('item:sold', itemData);
                  } 
                  console.log("Bid updated successfully");
                  // Broadcast updated item to all clients
                  const allItems = await item.find({});
                  this.io?.emit('items:update', allItems);
                })
                .catch((err) => {
                  console.error('Error updating item:', err);
                });
            } else {
              console.error('Item not found');
            }
          })
          .catch((err) => {
            console.error('Error fetching item:', err);
          });
      });

      // Handle message event
      socket.on('send:message', (chat) => {
        console.log("send:message received with -> ", chat);
        
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log("User disconnected");
        const username = this.usernamebySocketID.get(socket.id);
        if (username) {
          this.socketIDbyUsername.delete(username);
        }
        this.usernamebySocketID.delete(socket.id);
      });
    });
  }

  /**
   * Start auction timer for item remaining time updates
   */
  private startAuctionTimer(): void {
    // Timer function to decrement remaining time 
    this.intervalId = setInterval(() => {

    }, 1000);
  }

  /**
   * Broadcast new logged-in user to all clients
   */
  public newLoggedUserBroadcast(newUser: any): void {
    if (this.io) {
      for (const socketID of this.socketIDbyUsername.values()) {
        this.io.to(socketID).emit('new:item', newUser);
      }
    }
  }

  /**
   * Broadcast user logged-out event to all clients
   */
  public userLoggedOutBroadcast(loggedOutUser: any): void {
    console.log('RemoveItemBroadcast -> ', loggedOutUser);
    if (this.io) {
      for (const socketID of this.socketIDbyUsername.values()) {
        this.io.to(socketID).emit('remove:item', loggedOutUser);
      }
    }
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export default new SocketService();