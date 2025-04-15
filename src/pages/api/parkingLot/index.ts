import type { NextApiRequest, NextApiResponse } from 'next'
import { ParkingLotService } from '@/services/ParkingLotService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch(req.method){
    case("POST"):{
      try {
        const parkingLot = await ParkingLotService.createParkingLot()
        return res.status(201).json(parkingLot)
      } catch (error) {
        console.error('[CreateParkingLot]', error)
        return res.status(500).json({ error: 'Failed to create parking lot' })
      }
    }
    case("GET"):{
      try {
        const parkingLots = await ParkingLotService.getparkinglot()
        return res.status(200).json(parkingLots)
      } catch(error){
        console.error('[GetParkingLot]', error)
        return res.status(500).json({ error: 'Failed to get parking lot' })
      }
    }
    default: {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  }
}
