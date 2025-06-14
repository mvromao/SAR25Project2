export class Item {

	constructor (
      public _id: string,
      public description: string,
      public currentbid: number,
      public dateEnd: Date,
      public remainingtime: number,
      public buynow: number,
      public wininguser: string,
      public owner: string,
      public _secondsLeft?: number
	){}
}
