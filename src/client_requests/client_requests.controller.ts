import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { get } from 'http';
import { ClientRequestsService } from './client_requests.service';
import { CreateClientRequestDto } from './dto/create_client_request.dto';
import { UpdateDriverAssignedClientRequestDto } from './dto/update_driver_assigned_client_request.dto';
import { UpdateStatusClientRequestDto } from './dto/update_status_client_request.dto';
import { UpdateDriverRatingDto } from './dto/update_driver_rating.dto';
import { UpdateClientRatingDto } from './dto/update_client_rating.dto';

@Controller('client-requests')
    
export class ClientRequestsController {
    constructor(private clientRequestsService: ClientRequestsService){}
    @Get(':origin_lat/:origin_lng/:destination_lat/:distination_lng')
    getTimeAndDistanceClientRequest(
        @Param('origin_lat') origin_lat: number,
        @Param('origin_lng') origin_lng: number,
        @Param('destination_lat') destination_lat: number,
        @Param('distination_lng') distination_lng: number,
    ){
        return this.clientRequestsService.getTimeAndDistanceClientRequest(
            origin_lat,
            origin_lng,
            destination_lat,
            distination_lng
        )
    }


    @Get(':driver_lat/:driver_lng')
    getNearbyTripRequest(
        @Param('driver_lat') driver_lat: number, 
        @Param('driver_lng') driver_lng: number, 
    ) {
        return this.clientRequestsService.getNearbyTripRequest(
            driver_lat,
            driver_lng,
        );
    }

    @Get(':id_client_request')
    getByClientRequest(
        @Param('id_client_request') id_client_request: number, 
    ) {
        return this.clientRequestsService.getByClientRequest(id_client_request);
    }

    @Get('driver/assigned/:id_driver')
    getByDriverAssigned(
        @Param('id_driver') id_driver: number, 
    ) {
        return this.clientRequestsService.getByDriverAssigned(id_driver);
    }

    @Get('client/assigned/:id_client')
    getByClientAssigned(
        @Param('id_client') id_client: number, 
    ) {
        return this.clientRequestsService.getByClientAssigned(id_client);
    }

    @Post()
    create(@Body() clientRequest: CreateClientRequestDto) {
        return this.clientRequestsService.create(clientRequest);
    }

    @Put()
    updateDriverAssigned(@Body() driverAssigned: UpdateDriverAssignedClientRequestDto) {
        return this.clientRequestsService.updateDriverAssigned(driverAssigned);
    }
    @Put('update_status')
    updateStatus(@Body() updateStatusDto: UpdateStatusClientRequestDto) {
        return this.clientRequestsService.updateStatus(updateStatusDto);
    }

    @Put('update_driver_rating')
    updateDriverRating(@Body() driverRating: UpdateDriverRatingDto) {
        return this.clientRequestsService.updateDriverRating(driverRating);
    }


    @Put('update_client_rating')
    updateClientRating(@Body() clientRating: UpdateClientRatingDto) {
        return this.clientRequestsService.updateClientRating(clientRating);
    }
}
