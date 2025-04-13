import { ParkingSpot } from "./ParkingSpot";
import { VehicleSize } from "./VehicleSize";

  

export abstract class Vehicle{
    id?: string | null;
    licensePlate: string;
    size: VehicleSize | null;
    spotsNeeded: number;
    parkedSpots: ParkingSpot[];

    constructor(licensePlate: string) {
        this.licensePlate = licensePlate;
        this.size = null;
        this.spotsNeeded = 0;
        this.parkedSpots = [];
    }

    
    getSpotsNeeded(): number {
        return this.spotsNeeded
    }

    getSize(): VehicleSize | null  {
        return this.size
    }

    parkInSpot(spot: ParkingSpot): void {
        this.parkedSpots.push(spot);
    }

    clearSpots(): void {
        for (const spot of this.parkedSpots) {
          spot.removeVehicle();
        }
        this.parkedSpots = [];
      }
    
    abstract canFitSpot(spot: ParkingSpot): boolean;
    abstract print(): void

}

