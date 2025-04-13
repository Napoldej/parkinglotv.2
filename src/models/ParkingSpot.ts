import { Level } from "./Level";
import { VehicleSize } from "./VehicleSize";
import { Vehicle } from "./Vehicle";

// model ParkingSpot {
//     id             String        @id @default(auto()) @map("_id") @db.ObjectId
//     spotNumber     Int
//     row            Int
//     size           VehicleSize
//     levelId        String
//     level          Level         @relation(fields: [levelId], references: [id])
//     vehicleId      String?
//     vehicle        Vehicle?      @relation(fields: [vehicleId], references: [id])
//     isOccupied     Boolean       @default(false)  // New field to track if the spot is occupied
//   }

export class ParkingSpot {
  id?: string; 
  levelId?: string;  
  level: Level;
  row: number;
  spotNumber: number;
  vehicle: Vehicle | null;  
  size: VehicleSize;  
  isOccupied: boolean;
  vehicleId?: string | null ;

  constructor(level: Level, row: number, spotNumber: number, spotSize: VehicleSize) {
    this.level = level;
    this.levelId = level.id;
    this.row = row;
    this.spotNumber = spotNumber;
    this.size = spotSize; 
    this.isOccupied = false;
    this.vehicle = null;
    this.vehicleId = null;
  }

  isAvailable(): boolean {
    return !this.isOccupied;
  }

  canFitVehicle(vehicle: Vehicle): boolean {
    console.log(this.isAvailable() && vehicle.canFitSpot(this)) 
    return this.isAvailable() && vehicle.canFitSpot(this);
  }

  park(vehicle: Vehicle){
    if(!this.canFitVehicle(vehicle)){
        return false;
    }
    this.vehicle = vehicle;
    this.isOccupied = true;
    this.vehicleId = vehicle.id;
    vehicle.parkInSpot(this);
    return true
    }
    
    removeVehicle(): void {
        this.level.spotFreed();
        this.vehicle = null;
        this.isOccupied = false;
        this.vehicleId = null;
    }

    getRow(): number {
        return this.row
    }

}



