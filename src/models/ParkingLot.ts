// model ParkingLot {
//     id             String        @id @default(auto()) @map("_id") @db.ObjectId
//     levels         Level[]
//   }
import { Level } from "./Level"
import { Vehicle } from "./Vehicle";

export class ParkingLot {
    NUM_LEVELS: number;
    SPOTS_PER_LEVEL: number;
    levels: Level[];
    totalSpots: number;
    availableSpots: number;

    
    constructor() {
      this.NUM_LEVELS = 5;
      this.SPOTS_PER_LEVEL = 30;
      this.levels = [];
      this.totalSpots = this.NUM_LEVELS * this.SPOTS_PER_LEVEL;
      this.availableSpots = this.totalSpots;
      
      for (let i = 0; i < this.NUM_LEVELS; i++) {
        this.levels.push(new Level(i, this.SPOTS_PER_LEVEL));
      }
    }
  
    parkVehicle(vehicle: Vehicle) {
      for (let i = 0; i < this.levels.length; i++) {
        if (this.levels[i].parkVehicle(vehicle)) {
          this.availableSpots -= vehicle.getSpotsNeeded();
          return true;
        }
      }
      return false;
    }
  
    getStatus() {
      return {
        levels: this.levels.map(level => ({
          floorNumber: level.floor,
          spots: level.parkingSpots,
          availableSpots: level.availableSpots
        })),
        totalSpots: this.totalSpots,
        availableSpots: this.availableSpots
      };
    }
  }
  