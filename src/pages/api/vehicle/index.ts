import VehicleService from "@/services/VehicleService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method){
        case("POST"):{
            try {
                const vehicle = await VehicleService.createVehicle(req.body.licensePlate, req.body.size)
                return res.status(201).json(vehicle)
            } catch (error) {
                console.error('[CreateVehicle]', error)
                return res.status(500).json({ error: 'Failed to create vehicle' })
            }
        }
        case("GET"):{
            try {
                const vehicles = await VehicleService.getAllVehicles()
                return res.status(200).json(vehicles)
        } catch(error){
            console.error('[GetVehicle]', error)
            return res.status(500).json({ error: 'Failed to get vehicle' })
        }
        }
    }
}