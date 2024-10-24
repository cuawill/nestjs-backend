import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DriverTripOffersService } from './driver_trip_offers.service';
import { CreateDriverTripOffersDto } from './dto/create_driver_trip_offers.dto';

@Controller('driver-trip-offers')
export class DriverTripOffersController {
    constructor(private driverTripOffersService: DriverTripOffersService) {}

    @Get('findByClientRequest/:id_client_request')
    findByClientRequest(@Param('id_client_request') id_client_request: number) {
        return this.driverTripOffersService.findByClientRequest(id_client_request);
    }

    @Post()
    create(@Body() driverTripOffer: CreateDriverTripOffersDto) {
        return this.driverTripOffersService.create(driverTripOffer);
    }

}
