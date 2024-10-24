import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DriversPosition } from './drivers_position.entity';
import { CreateDriverPositionDto } from './dto/create_driver_position.dto';
import { DriversPositionService } from './drivers_position.service';

@Controller('drivers-position')
export class DriversPositionController {
    constructor(
        private driversPositionService: DriversPositionService
    ) {}
    @Post()
    create(@Body() driversPosition: CreateDriverPositionDto) {
        return this.driversPositionService.create(driversPosition)
    }  
    
    @Get(':id_driver')
    getDriverPosition(@Param('id_driver') id_driver: number) {
        return this.driversPositionService.getDriverPosition(id_driver);        
    }

    @Get(':client_lat/:client_lng')
    getNearbyDrivers(@Param('client_lat') client_lat: number, @Param('client_lng') client_lng: number) {
        return this.driversPositionService.getNearbyDrivers(client_lat, client_lng);        
    }

    @Delete(':id_driver')
    delete(@Param('id_driver', ParseIntPipe) id_driver: number ) {
        return this.driversPositionService.delete(id_driver);
    }
}
