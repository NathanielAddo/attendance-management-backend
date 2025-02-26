// event.ts

export interface Event {
    id?: number;
    name: string;
    start_time: string;
    end_time: string;
    date: string;
    country: string;
    branch: string;
    //city: string;
    // Adding the missing properties from Event (bubbles, cancelBubble, cancelable, composed, etc.)
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    // You can add more properties here if needed
  }
  
  export const EventModel = class implements Event {
    public id?: number;
    public name: string;
    public start_time: string;
    public end_time: string;
    public date: string;
    public country: string;
    public branch: string;
    
    // Adding the missing properties with default values
    public bubbles: boolean = false;
    public cancelBubble: boolean = false;
    public cancelable: boolean = false;
    public composed: boolean = false;
  
    constructor(
      name: string,
      start_time: string,
      end_time: string,
      date: string,
      country: string,
      branch: string,
      id?: number
    ) {
      this.name = name;
      this.start_time = start_time;
      this.end_time = end_time;
      this.date = date;
      this.country = country;
      this.branch = branch;
      if (id) this.id = id;
    }
  
    static fromRow(row: any): Event {
      return new EventModel(
        row.name,
        row.start_time,
        row.end_time,
        row.date,
        row.country,
        row.branch,
        row.id
      );
    }
  
    static toDbFormat(event: Event): any[] {
      return [
        event.name,
        event.start_time,
        event.end_time,
        event.date,
        event.country,
        event.branch
      ];
    }
  };
  