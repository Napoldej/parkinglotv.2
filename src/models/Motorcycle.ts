import { VehicleSize } from "./VehicleSize";
import { Vehicle } from "./Vehicle";
import { ParkingSpot } from "./ParkingSpot";

export class Bus extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate);
        this.size = VehicleSize.Motorcycle;
        this.spotsNeeded = 4;
    }

    canFitSpot(spot: ParkingSpot): boolean {
        return true
    }

    print(): void {
        console.log("M")
    }
}