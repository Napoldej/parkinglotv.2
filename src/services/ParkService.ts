import { Bus } from "@/models/Bus";
import { Car } from "@/models/Car";
import { Motorcycle } from "@/models/Motorcycle";
import { ParkingSpot } from "@/models/ParkingSpot";
import PrismaDB from "@/lib/prisma";
import { Level } from "@/models/Level";
import { ParkingLotService } from "./ParkingLotService";



export class ParkingService {

    static prisma = PrismaDB.getInstance();
    
    static async parkVehicle(licensePlate: string) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: {
                licensePlate: licensePlate
            }
        });

        if (!vehicle) {
            return { success: false, message: "Vehicle not found" };
        }
        console.log(typeof vehicle)

        let vehicleInstance: Motorcycle | Car | Bus | null = null;
        switch(vehicle.size) {
            case("Motorcycle"):
                vehicleInstance = new Motorcycle(licensePlate);
                break;
            case("Compact"):
                vehicleInstance = new Car(licensePlate);
                break;
            case("Large"):
                vehicleInstance = new Bus(licensePlate);
                break;
        }
        vehicleInstance!.id = vehicle.id;


        const parkinglot = await this.prisma.parkingLot.findFirst()
        if (!parkinglot) {
            throw new Error("Parking lot not found");
        }
        const parkinglotInstance = await ParkingLotService.getinstance(parkinglot.id);
        console.log(parkinglotInstance)

        
        const parked = parkinglotInstance!.parkVehicle(vehicleInstance!);
        console.log(parked)
        
        if (parked) {
            const dbparkingLot = await this.prisma.parkingLot.findFirst()
            if (!dbparkingLot) {
                throw new Error("Parking lot not found");
            }
            const occupiedSpots = vehicleInstance!.parkedSpots;
            const updatePromises = occupiedSpots.map(async (spot) => {
                const dbSpot = await this.prisma.parkingSpot.findFirst({
                  where: {
                    levelId: spot.level.id,
                    row: spot.row,
                    spotNumber: spot.spotNumber
                  }
                });
              
                if (!dbSpot) {
                  console.error(`DB spot not found for row ${spot.row}, spot ${spot.spotNumber}`);
                  return;
                }
              
                return this.prisma.parkingSpot.update({
                  where: { id: dbSpot.id },
                  data: {
                    isOccupied: true,
                    vehicleId: vehicle.id
                  }
                });
              });
              
            await Promise.all(updatePromises);
              
            

            await this.prisma.parkingLot.update({
                where: { 
                    id: dbparkingLot.id 
                },
                data: {
                    availableSpots: parkinglotInstance!.availableSpots
                }
            });
            
            return { success: true, message: "Vehicle parked successfully" };
        }
        
        return { success: false, message: "Could not find suitable parking spot" };
    }

    static async UnparkVehicle(licensePlate: string) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: {
                licensePlate: licensePlate
            },
            include:{
                parkedSpots: {
                    include: {
                        level: true
                    }
                }
            }
        });

        if (!vehicle) {
            return { success: false, message: "Vehicle not found" };
        }
        let vehicleInstance: Motorcycle | Car | Bus | null = null;
        switch(vehicle.size) {
            case("Motorcycle"):
                vehicleInstance = new Motorcycle(licensePlate);
                break;
            case("Compact"):
                vehicleInstance = new Car(licensePlate);
                break;
            case("Large"):
                vehicleInstance = new Bus(licensePlate);
                break;
        }
        vehicleInstance!.id = vehicle.id
        for(let i = 0; i < vehicle.parkedSpots.length; i++){
            const levelInstance = new Level(vehicle.parkedSpots[i].level.floor, vehicle.parkedSpots[i].level.availableSpots);
            let spot = new ParkingSpot(vehicle.parkedSpots[i].level, vehicle.parkedSpots[i].row, 
                vehicle.parkedSpots[i].spotNumber, 
                vehicle.parkedSpots[i].size);
            spot.level = levelInstance;
            spot.id = vehicle.parkedSpots[i].id;
            spot.vehicle = vehicleInstance;
            spot.vehicleId = vehicle.id
            vehicleInstance!.parkedSpots.push(spot);
            
        }
        try{
            vehicleInstance!.clearSpots();
            const update_parkingspot = await this.prisma.parkingSpot.updateMany({
                where:{
                    vehicleId: vehicle.id
                },
                data:{
                    isOccupied: false,
                    vehicleId: null
                }
            })
            console.log(update_parkingspot)
        }catch(e){
            console.log(e)
            return { success: false, message: "Could not unpark vehicle" };
        }
        return { success: true, message: "Vehicle unparked successfully" };        
    }
}