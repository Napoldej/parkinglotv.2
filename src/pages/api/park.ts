import { ParkingService } from "@/services/ParkService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method){
        case("POST"):{
            const parked = await ParkingService.parkVehicle(req.body.licensePlate)
            return res.status(200).json(parked)
        }
    }
}