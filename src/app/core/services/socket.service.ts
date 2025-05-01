import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { SigninService } from './signin.service';

// Import models from their new location
import { Chat } from '../models/chat';
import { Item } from '../models/item';
import { Useronline } from '../models/useronline';

@Injectable({
  providedIn: 'root'
})
export class SocketService {  
 
  private url = window.location.origin;
  //constructor receives IO object and SignInService to check for authentication token
  constructor(private signInService: SigninService, private socket: Socket) { }
 

  connect() {             //add the jwt token to the options 
    // Set authentication token
    this.socket.ioSocket.auth = { token: this.signInService.token.token };
    this.socket.connect();
    console.log('Websocket connected with token', this.signInService.token.token);
  }

  disconnect(){
  	 this.socket.disconnect();
  }

  // sends a new event with name EventName and data Data
  sendEvent (EventName:any,Data:any){
  						 // newUser:username' is the name of the event in the server. 	
  		this.socket.emit(EventName, Data);
  }

   // configures an observable to emit a value every time we receive a event with name
  getEvent(Eventname: any){
  	 let observable = new Observable (observer =>{
  	 	this.socket.on(Eventname, (data:any) => {
  	 		observer.next(data);
  	 	});
  	 })
  	 return observable;
  }

}
