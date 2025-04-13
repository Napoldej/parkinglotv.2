// model Level {
//     id             String        @id @default(auto()) @map("_id") @db.ObjectId
//     floor          Int
//     parkingLotId   String
//     parkingLot     ParkingLot   @relation(fields: [parkingLotId], references: [id])
//     parkingSpots   ParkingSpot[]
//}
import { VehicleSize } from "./VehicleSize";
import { ParkingSpot } from "./ParkingSpot";
import { Vehicle } from "./Vehicle";


export class Level {
    id?: string;
    floor: number;
    parkingSpots: ParkingSpot[];
    availableSpots: number;
    SPOT_PER_ROWS: number;

    constructor(floor: number, numberSpots: number){
        this.floor = floor;
        this.parkingSpots = [];
        this.availableSpots = numberSpots;
        this.SPOT_PER_ROWS = 10;

        const largeSpots = Math.floor(numberSpots / 4);
        const motorcycleSpots = Math.floor(numberSpots / 4);
        const compactSpots = numberSpots - largeSpots - motorcycleSpots;
        for(let i = 0; i < numberSpots; i++){
            let spots = VehicleSize.Motorcycle;
            if ((i < largeSpots)) {
                spots = VehicleSize.Large;
            }
            else if(i < largeSpots + compactSpots){
                spots= VehicleSize.Compact;
            }
            let row = i / this.SPOT_PER_ROWS
            this.parkingSpots[i] = new ParkingSpot(this, row, i, spots);
        }
        this.availableSpots = numberSpots
    }

    getavailableSpots(): number {
        return this.availableSpots
    }

    parkVehicle(vehicle: Vehicle): boolean {
        if (this.getavailableSpots() < vehicle.getSpotsNeeded()) {
          return false;
        }
        
        const spotNumber = this.findAvailableSpots(vehicle);
        if (spotNumber < 0) {
          return false;
        }
        
        return this.parkStartingAtSpot(spotNumber, vehicle);
      }
      
      parkStartingAtSpot(spotNumber: number, vehicle: Vehicle) {
        vehicle.clearSpots();
        let success = true;
        
        for (let i = spotNumber; i < spotNumber + vehicle.getSpotsNeeded(); i++) {
          success = success && this.parkingSpots[i].park(vehicle);
        }
        
        this.availableSpots -= vehicle.getSpotsNeeded();
        return success;
      }
      
      findAvailableSpots(vehicle: Vehicle) {
        const spotsNeeded = vehicle.getSpotsNeeded();
        let lastRow = -1;
        let spotsFound = 0;
        
        for (let i = 0; i < this.parkingSpots.length; i++) {
          const spot = this.parkingSpots[i];
          
          if (lastRow !== spot.getRow()) {
            spotsFound = 0;
            lastRow = spot.getRow();
          }
          
          if (spot.canFitVehicle(vehicle)) {
            spotsFound++;
          } else {
            spotsFound = 0;
          }
          
          if (spotsFound === spotsNeeded) {
            return i - (spotsNeeded - 1);
          }
        }
        
        return -1;
      }
      
      spotFreed() {
        this.availableSpots++;
      }

}



