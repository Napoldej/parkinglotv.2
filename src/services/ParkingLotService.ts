import { ParkingLot } from '@/models/ParkingLot';
import PrismaDB from '@/lib/prisma';
import { Level } from '@/models/Level';
import { ParkingSpot } from '@/models/ParkingSpot';



export class ParkingLotService {
  static prisma = PrismaDB.getInstance();
  static async createParkingLot() {
    const parkingLot = new ParkingLot();

    const levelsData = parkingLot.levels.map(level => {
      const parkingSpotsData = level.parkingSpots.map(spot => ({
        spotNumber: spot.spotNumber,
        row: spot.row,
        size: spot.size,
        isOccupied: false
      }));

      return {
        floor: level.floor,
        parkingSpots: {
          create: parkingSpotsData
        }
      };
    });
    const savedParkingLot = await this.prisma.parkingLot.create({
      data: {
        totalSpots: parkingLot.totalSpots,
        availableSpots: parkingLot.availableSpots,
        levels: {
          create: levelsData
        }
      },
      include: {
        levels: {
          include: {
            parkingSpots: true
          }
        }
      }
    });

    return savedParkingLot;
  }


  static async deleteparkinglotwithcascade(parkingLotId : string){
    const levels = await this.prisma.level.findMany({
        where: { parkingLotId },
        select: { id: true }
      })
    
      const levelIds = levels.map((l: { id: string }) => l.id) 
    
      await this.prisma.parkingSpot.deleteMany({
        where: { levelId: { in: levelIds } }
      })
    
      await this.prisma.level.deleteMany({
        where: { parkingLotId }
      })
    
      await this.prisma.parkingLot.delete({
        where: { id: parkingLotId }
      })
    
      console.log(`Deleted parking lot ${parkingLotId} and all related data`)
    }

    static async getparkinglot(){
        return await this.prisma.parkingLot.findMany({
            include: {
                levels: {
                    include:{
                        parkingSpots: true
                    }
                }
            }
        })
    }

    static async getinstance(id: string) {
      const data = await this.prisma.parkingLot.findUnique({
        where: { id },
        include: { 
          levels: {
            include: { parkingSpots: true } 
          }
        },
      });
      
      if (!data) return null;
    
      const levelInstances = data.levels.map((levelData: any) => {
        const level = new Level(levelData.floor, levelData.availableSpots);
        level.id = levelData.id;
        level.availableSpots = levelData.availableSpots;
    
        level.parkingSpots = levelData.parkingSpots.map((spot: any) => {
          const ps = new ParkingSpot(level, spot.row, spot.spotNumber, spot.size);
          ps.id = spot.id;
          ps.isOccupied = spot.isOccupied;
          return ps;
        });
    
        return level;
      });
    
      const parkingLot = new ParkingLot();
      parkingLot.id = data.id;
      parkingLot.totalSpots = data.totalSpots;
      parkingLot.availableSpots = data.availableSpots;
      parkingLot.levels = levelInstances;
    
      return parkingLot;
    }
}