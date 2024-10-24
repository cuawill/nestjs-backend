import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverTripOffers } from './driver_trip_offers.entity';
import { Repository } from 'typeorm';
import { CreateDriverTripOffersDto } from './dto/create_driver_trip_offers.dto';

@Injectable()
export class DriverTripOffersService {
    constructor(@InjectRepository(DriverTripOffers) private driverTripOffersRepository: Repository<DriverTripOffers>) {}

    create(driverTripOffer: CreateDriverTripOffersDto) {
        const newData = this.driverTripOffersRepository.create(driverTripOffer);
        return this.driverTripOffersRepository.save(newData);
    }



    async findByClientRequest(id_client_request: number) {
        const data = await this.driverTripOffersRepository.query(`
        SELECT
            DTO.id,
            DTO.id_client_request,
            DTO.id_driver,
            DTO.fare_offered,
            DTO.time,
            DTO.distance,
            DTO.updated_at,
            DTO.created_at,
             JSON_OBJECT(
                 "name", U.name,
                 "lastname", U.lastname,
                 "image", U.image,
                 "phone", U.phone
             ) AS driver,
             JSON_OBJECT(
                 "brand", DCI.brand,
                 "plate", DCI.plate,
                 "color", DCI.color
             ) AS car
         FROM
            driver_trip_offers AS DTO
        INNER JOIN
            users AS U
        ON
            U.id = DTO.id_driver
        LEFT JOIN 
            driver_car_info AS DCI
        ON
            DCI.id_driver = DTO.id_driver
        WHERE
            id_client_request = ${id_client_request}

        `);
        return data;
    }
}
