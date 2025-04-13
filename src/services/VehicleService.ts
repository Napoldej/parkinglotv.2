import { Bus } from "@/models/Bus";
import { Motorcycle} from "@/models/Motorcycle";
import { Car } from "@/models/Car";
import PrismaDB from "@/lib/prisma";


const prisma = PrismaDB.getInstance()

export default class VehicleService {
    static async createVehicle(licensePlate: string, size: string){
        let vehicleInstance: Motorcycle | Car | Bus | null = null
        if (size === "Motorcycle") {
            vehicleInstance = new Motorcycle(licensePlate);
        } else if (size === "Compact") {
            vehicleInstance = new Car(licensePlate);
        } else if (size === "Large") {
            vehicleInstance = new Bus(licensePlate);
        }
        if (!vehicleInstance || !vehicleInstance.size) {
            throw new Error("Vehicle or size is missing");
          }
        const savedVehicle = await prisma.vehicle.create({
            data:{
            licensePlate : vehicleInstance!.licensePlate,
            size: vehicleInstance!.size,
            spotsNeeded: vehicleInstance!.spotsNeeded
        }}
    )

        return savedVehicle;
    }

    static async getAllVehicles(){
        return await prisma.vehicle.findMany({
            include:{
                parkedSpots: {
                    include: {
                        level: true
                    }
                }
            }
        })
    }
}