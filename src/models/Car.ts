import { VehicleSize } from "./VehicleSize";
import { Vehicle } from "./Vehicle";
import { ParkingSpot } from "./ParkingSpot";
export class Car extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate);
        this.size = VehicleSize.Compact;
        this.spotsNeeded = 4;
    }

    canFitSpot(spot: ParkingSpot): boolean {
        return spot.size === VehicleSize.Large || spot.size === VehicleSize.Compact
    }

    print(): void {
        console.log("C")
    }
}