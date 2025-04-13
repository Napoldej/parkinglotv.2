import type { NextApiRequest, NextApiResponse } from 'next'
import { ParkingLotService } from '@/services/ParkingLotService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method){
        case("DELETE"):
            try {
                const { id } = req.query;
                const deletedParkingLot = await ParkingLotService.deleteparkinglotwithcascade(id as string)
                return res.status(200).json(deletedParkingLot)
            }catch (error) {
                return res.status(500).json({ error: 'Failed to delete parking lot' })
            }
        }
}
