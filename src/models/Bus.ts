import { VehicleSize } from "./VehicleSize";
import { Vehicle } from "./Vehicle";
import { ParkingSpot } from "./ParkingSpot";
export class Bus extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate);
        this.size = VehicleSize.Large;
        this.spotsNeeded = 5;
    }

    canFitSpot(spot: ParkingSpot): boolean {
        return spot.size === VehicleSize.Large
    }

    print(): void {
        console.log("B")
    }
}