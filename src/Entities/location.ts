// location.ts

// Define the Location entity as an interface
export interface Location {
    id: number;
    name: string;
    address: string;
    coordinates: string; // Assuming coordinates are stored as a string (e.g., JSON or a lat/long string)
    radius: number;
    country: string;
    branch: string;
  }
  
  // You could alternatively create a class if you plan to extend this with methods or additional logic:
  export class LocationEntity {
    id: number;
    name: string;
    address: string;
    coordinates: string;
    radius: number;
    country: string;
    branch: string;
  
    constructor(
      id: number,
      name: string,
      address: string,
      coordinates: string,
      radius: number,
      country: string,
      branch: string
    ) {
      this.id = id;
      this.name = name;
      this.address = address;
      this.coordinates = coordinates;
      this.radius = radius;
      this.country = country;
      this.branch = branch;
    }
  }
  