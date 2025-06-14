import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {interval, Subscription} from 'rxjs';
// Import services from the barrel file
import { AuctionService, SocketService, SigninService } from '../../../../core/services';

// Import models from the barrel file 
import { Item, User, Chat, Marker } from '../../../../core/models';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css'],
  standalone: false
})
export class AuctionComponent implements OnInit {
  items: Item[]; //array of items to store the items.
  users: User[];
  displayedColumns: string[] //Array of Strings with the table column names
  message: string; // message string
  destination : string; //string with the destination of the current message to send. 
  ChatMessage: string; // message string: string; // message string
  showBid: boolean;  //boolean to control if the show bid form is placed in the DOM
  showMessage: boolean; //boolean to control if the send message form is placed in the DOM
  selectedItem!: Item; //Selected Item
  bidForm! : FormGroup; //FormGroup for the biding
  userName!: string;
  errorMessage: string; //string to store error messages received in the interaction with the api
  mapOptions: google.maps.MapOptions;
  markers: Marker[]; //array to store the markers for the looged users posistions.
  centerLat: number;
  centerLong: number;
  showRemove: boolean;
  soldHistory: string[];
  chats: Chat[]; //array for storing chat messages
  counter: number;

  constructor( private formBuilder: FormBuilder, private router: Router, private socketservice: SocketService, private auctionservice: AuctionService,
   private signinservice: SigninService) {
    this.items = [];
    this.users = [];
    this.soldHistory = [];
    this.chats = [];
    this.counter = 0;
    this.message = "";
    this.destination ="";
    this.ChatMessage = "";
    this.showBid = false;
    this.showMessage = false;
    this.userName = this.signinservice.token.username;
    this.errorMessage = "";
    this.displayedColumns = ['description', 'currentbid', 'buynow', 'remainingtime', 'wininguser', 'owner'];
    this.centerLat = this.signinservice.latitude != null ? this.signinservice.latitude : 38.640026;
    this.centerLong = this.signinservice.longitude != null ? this.signinservice.longitude : -9.155379;
    this.markers = [];
    this.showRemove = false;
    this.mapOptions = {
      center: { lat: this.centerLat, lng: this.centerLong },
      zoom: 10
    };
  }
  private timerSubscription!: Subscription;
greaterThanCurrentBid(currentBid: number): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const bidValue = control.value;
      if (bidValue && currentBid && bidValue < currentBid) {
        return { greaterThanCurrentBid: true };
      }
      return null;
    };
  }

updateBidValidator() {
  this.bidForm.get('bid')?.setValidators([
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    this.greaterThanCurrentBid(this.selectedItem?.currentbid ?? 0)
  ]);
  this.bidForm.get('bid')?.updateValueAndValidity();
}

ngOnInit(): void {
  	 this.message= "Hello " + this.userName + "! Welcome to the SAR auction site.";
      this.timerSubscription = interval(1000).subscribe(() => {
      this.updateRemainingTimes();
    });
  	 //create bid form
  	 this.bidForm = this.formBuilder.group({
      bid: ['', Validators.compose([Validators.required,Validators.pattern("^[0-9]*$"), this.greaterThanCurrentBid(this.selectedItem?.currentbid)])]
  	 });


  	 // Get initial item data from the server api using http call in the auctionservice
     this.auctionservice.getItems()
        .subscribe({next: result => {
          let receiveddata = result as Item[]; // cast the received data as an array of items (must be sent like that from server)
          this.items = receiveddata;
          if (this.selectedItem) {
            const updated = this.items.find(i => i.description === this.selectedItem.description);
            if (updated) {
              this.selectedItem = updated;
              this.updateBidValidator();
            }
          }
          console.log ("getItems Auction Component -> received the following items: ", receiveddata);
        },
        error: error => this.errorMessage = <any>error });

     // Get initial list of logged in users for googleMaps using http call in the auctionservice
      this.auctionservice.getUsers()
        .subscribe({
          next: result => {
          let receiveddata = result as User[]; // cast the received data as an array of users (must be sent like that from server)
            console.log("getUsers Auction Component -> received the following users: ", receiveddata);
          // do the rest of the needed processing here
        },
        error: error => this.errorMessage = <any>error });

  //subscribe to the incoming websocket events

  //example how to subscribe to the server side regularly (each second) items:update event
const updateItemsSubscription = this.socketservice.getEvent("items:update")
  .subscribe(data => {
    let receiveddata = data as Item[];
    if (Array.isArray(receiveddata)) {
      // Remove items that are already expired
      const now = Date.now();
      receiveddata.forEach(item => {
        let end: number | undefined;
        if (typeof item.dateEnd === 'string') {
          end = new Date(item.dateEnd).getTime();
        } else if (typeof item.dateEnd === 'number') {
          end = item.dateEnd;
        } else {
          end = undefined;
        }
        if (end && !isNaN(end)) {
          item.remainingtime = Math.max(Math.floor((end - now) / 1000), 0);
        } else {
          item.remainingtime = 0;
        }
      });
      this.items = receiveddata.filter(item => item.remainingtime > 0);

      if (this.selectedItem) {
        const updated = this.items.find(i => i._id === this.selectedItem._id);
        if (updated) {
          this.selectedItem = updated;
          this.updateBidValidator();
        } else {
          this.selectedItem = undefined!;
          this.showBid = false;
        }
      }
    }
  });

  //subscribe to the new user logged in event that must be sent from the server when a client logs in
  const newUserSubscription = this.socketservice.getEvent("newUser:username")
    .subscribe(data => {
      let receiveddata = data as User;
      console.log("New user logged in: ", receiveddata);
      // Add the new user to the users array if not already present
      if (!this.users.some(user => user.username === receiveddata.username)) {
        this.users.push(receiveddata);
      }
    });
  
  //subscribe to the user logged out event that must be sent from the server when a client logs out
  const userLoggedOutSubscription = this.socketservice.getEvent("user:logout")
    .subscribe(data => {
      let receiveddata = data as User;
      console.log("User logged out: ", receiveddata);
      // Remove the user from the users array
      this.users = this.users.filter(user => user.username !== receiveddata.username);
    });

  //subscribe to a receive:message event to receive message events sent by the server
  //const receiveMessageSubscription = this.socketservice.getEvent("receive:message")
  //  .subscribe(data => {
  //    let receiveddata = data as Chat;
  //    console.log("New message received: ", receiveddata);
  //    // Add the new message to the messages array
  //    this.messages.push(receiveddata);
  //  });
  //  

  //subscribe to the item sold event sent by the server for each item that ends.
  const itemSoldSubscription = this.socketservice.getEvent("item:sold")
  .subscribe(data => {
    let receiveddata = data as Item;
    console.log("Item sold: ", receiveddata);

    // Find the item in the items array and set its remainingtime to 5
    const idx = this.items.findIndex(item => item._id === receiveddata._id);
    if (idx !== -1) {
      this.items[idx].remainingtime = 5;
    }

    // Optionally, update selectedItem if it's the sold item
    if (this.selectedItem && this.selectedItem._id === receiveddata._id) {
      this.selectedItem.remainingtime = 5;
    }
  });
  }

   logout(){
    //call the logout function in the signInService to clear the token in the browser
    this.signinservice.logout();  // Tem que estar em primeiro para ser apagado o token e nao permitir mais reconnects pelo socket
  	//perform any needed logout logic here
  	this.socketservice.disconnect();
    //navigate back to the log in page
    this.router.navigate(['/signin']);
  }

  //function called when an item is selected in the view
  onRowClicked(item: Item){
  	console.log("Selected item = ", item);
  	this.selectedItem = item;
  	this.showBid = true; // makes the bid form appear
    
    // DISCUSSAO : Atualiza o Bid Form com o valor da bid+1 e verifica se o utilizador é o dono do item.
    this.bidForm.reset(); 
    this.bidForm.setValue({ bid: item.currentbid + 1 }); 
    this.updateBidValidator(); 
    
    if (!item.owner.localeCompare(this.userName)) {
      this.showRemove = true;
      this.showMessage = false;
    }
    else {
      this.showRemove = false;
      this.destination = this.selectedItem.owner;
      this.showMessage = true;
    }
  }

  //function called when a received message is selected. 
  onMessageSender(ClickedChat: Chat) {
    //destination is now the sender of the selected received message. 
  }

  // function called when the submit bid button is pressed
   submit(){
  	console.log("submitted bid = ", this.bidForm.value.bid);
  	//send an event using the websocket for this use the socketservice
    // example :  this.socketservice.sendEvent('eventname',eventdata);
    this.socketservice.sendEvent('send:bid', {
      item: this.selectedItem,
      bid: this.bidForm.value.bid,
      user: this.userName
    });

    this.bidForm.reset(); 
    this.showBid = false; 
  } 
  //function called when the user presses the send message button
  sendMessage(){
    console.log("Message  = ", this.ChatMessage);
  }

  //function called when the cancel bid button is pressed.
   cancelBid(){
   	this.bidForm.reset(); //clears bid value
   }

  //function called when the buy now button is pressed.
  /// sets the field value to the buy now value of the selected item 
  buyNow(){
   	this.bidForm.setValue({bid: this.selectedItem.buynow});
   	this.message= this.userName + " please press the Submit Bid button to procced with the Buy now order.";

    this.selectedItem.currentbid = this.selectedItem.buynow;
    this.selectedItem.remainingtime = 5;

    this.socketservice.sendEvent('send:bid', {
      item: this.selectedItem,
      bid: this.bidForm.value.bid,
      user: this.userName
    });

    this.items = this.items.filter(item => item._id !== this.selectedItem._id);
    this.showBid = false;
    this.selectedItem = undefined!;
}


  //function called when the remove item button is pressed.
  // DISCUSSAO : Remover o item da database 
  removeItem() {
    console.log("removeItem -> Removing item: ", this.selectedItem.description);
    //use an HTTP call to the API to remove an item using the auction service.
    this.auctionservice.removeItem(this.selectedItem)
      .subscribe({
        next: (response) => {
          console.log("Item removed successfully.");
          this.items = this.items.filter(item => item._id !== this.selectedItem._id); 
          this.showBid = false; 
          this.selectedItem = undefined!; 
        },
        error: (err) => {
          console.error("Error removing item:", err);
        }
      }); 
  }

  /**
   * Calculate the time progress percentage for the auction item
   * @param item The auction item
   * @returns A number between 0-100 representing progress percentage
   */
  getTimeProgress(item: Item): number {
    if (!item || !item.remainingtime) {
      return 0;
    }

    const maxTime = 3600; // Assuming initial time is 1 hour (3600 seconds)
    const remainingTime = item.remainingtime;
    
    // Calculate elapsed time as a percentage
    const elapsedPercentage = ((maxTime - remainingTime) / maxTime) * 100;
    
    // Return a percentage value between 0-100
    return Math.min(Math.max(elapsedPercentage, 0), 100);
  }

  
  updateRemainingTimes(): void {
    if(!Array.isArray(this.items)){
      this.items = [];
    }
    const now = Date.now();
    this.items.forEach(item => {
      let end: number | undefined;
      if (typeof item.dateEnd === 'string') {
        end = new Date(item.dateEnd).getTime();
      } else if (typeof item.dateEnd === 'number') {
        end = item.dateEnd;
      } else {
        end = undefined;
      }
    
      if (end && !isNaN(end)) {
        item.remainingtime = Math.max(Math.floor((end - now) / 1000), 0); // seconds
      } else {
        item.remainingtime = 0;
      }
    });

    this.items = this.items.filter(item => item.remainingtime > 0);
  }

  formatRemainingTime(seconds: number): string {
    if (typeof seconds !== 'number' || seconds < 0) return '0 S';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    let result = '';
    if (days > 0) result += `${days} D `;
    if (hours > 0 || days > 0) result += `${hours} H `;
    if (mins > 0 || hours > 0 || days > 0) result += `${mins} M `;
    result += `${secs} S`;
    return result.trim();
  }
  /**
   * Determine the color of the progress bar based on remaining time
   * @param item The auction item
   * @returns Material color for the progress bar
   */
  getTimeProgressColor(item: Item): string {
    if (!item || !item.remainingtime || item.remainingtime <= 0) {
      return 'warn'; // Red when no time or item data
    }

    // More than 50% time remaining - show green
    if (item.remainingtime > 1800) {
      return 'primary'; // Blue
    } 
    // Between 25% and 50% time remaining - show accent (amber)
    else if (item.remainingtime > 900) {
      return 'accent';
    } 
    // Less than 25% time remaining - show red
    else {
      return 'warn'; // Red
    }
  }
}
