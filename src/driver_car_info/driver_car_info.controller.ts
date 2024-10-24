import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDriverCarInfoDto } from './dto/create_driver_car_info.dto';
import { DriverCarInfoService } from './driver_car_info.service';

@Controller('driver-car-info')
export class DriverCarInfoController {
    constructor(private driverCarInfoService: DriverCarInfoService) {}

    @Get(':id_driver')
    findByIdDriver(@Param('id_driver') id_driver: number) {
        return this.driverCarInfoService.findByIdDriver(id_driver);
    }

    @Post()
    create(@Body() driverCarInfo: CreateDriverCarInfoDto) {
        return this.driverCarInfoService.create(driverCarInfo);
    }

}
