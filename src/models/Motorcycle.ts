import { VehicleSize } from "./VehicleSize";
import { Vehicle } from "./Vehicle";
import { ParkingSpot } from "./ParkingSpot";

export class Motorcycle extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate);
        this.size = VehicleSize.Motorcycle;
        this.spotsNeeded = 1;
    }

    canFitSpot(spot: ParkingSpot): boolean {
        return true
    }

    print(): void {
        console.log("M")
    }
}