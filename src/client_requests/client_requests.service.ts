import { Client, DistanceMatrixResponseData, TravelMode } from '@googlemaps/google-maps-services-js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRequests, Status } from 'src/time_and_distance_values/client_requests.entity';
import { TimeAndDistanceValuesService } from 'src/time_and_distance_values/time_and_distance_values.service';
import { Repository } from 'typeorm';
import { CreateClientRequestDto } from './dto/create_client_request.dto';
import { UpdateDriverAssignedClientRequestDto } from './dto/update_driver_assigned_client_request.dto';
import { UpdateStatusClientRequestDto } from './dto/update_status_client_request.dto';
import { UpdateDriverRatingDto } from './dto/update_driver_rating.dto';
import { UpdateClientRatingDto } from './dto/update_client_rating.dto';
import { FirebaseRepository } from 'src/firebase/firebase.repository';
const API_KEY = 'AIzaSyCQyrAJeGCBYRXsFWuyeA-m_5E3bpT0pc8';


@Injectable()
export class ClientRequestsService extends Client  {

    
    constructor(
        @InjectRepository(ClientRequests) private clientRequestsRepository: Repository<ClientRequests>,
        private timeAndDistanceValuesService: TimeAndDistanceValuesService,
        private firebaseRepository: FirebaseRepository

    ){
        super();
    }

    async create(clientRequest: CreateClientRequestDto){
         try {
             await this.clientRequestsRepository.query(`
                 INSERT INTO
                     client_requests(
                         id_client,
                         fare_offered,
                         pickup_description,
                         destination_description,
                         pickup_position,
                         destination_position
                     )
                 VALUES(
                    ${clientRequest.id_client},
                    ${clientRequest.fare_offered},
                    '${clientRequest.pickup_description}',
                    '${clientRequest.destination_description}',
                    ST_GeomFromText('POINT(${clientRequest.pickup_lat} ${clientRequest.pickup_lng})', 4326),
                    ST_GeomFromText('POINT(${clientRequest.destination_lat} ${clientRequest.destination_lng})', 4326)
                 )
             `);
             
             const data = await this.clientRequestsRepository.query(`SELECT MAX(id) AS id FROM client_requests`);
             const nearbyDrivers = await this.clientRequestsRepository.query(`
                SELECT
                U.id,
                U.name,
                U.notification_token,
                DP.position,
                ST_Distance_Sphere(DP.position, ST_GeomFromText('POINT(${clientRequest.pickup_lat} ${clientRequest.pickup_lng})', 4326)) AS distance
            FROM
                users AS U
            LEFT JOIN
                drivers_position AS DP
            ON
                U.id = DP.id_driver    
            HAVING
                distance < 60000
            `);
            const notificationTokens = [];
            nearbyDrivers.forEach((driver, index) => {
                 if (!notificationTokens.includes(driver.notification_token)) {
                     if (driver.notification_token !== '') {
                        notificationTokens.push(driver.notification_token);
                    }
                    
                }
            });
            console.log('NOTIFICATION TOKEN:', notificationTokens);
            this.firebaseRepository.sendMessageToMultipleDevices({
                "tokens": notificationTokens,
                "notification":{
                  "title":"Solicitud de viaje",
                  "body": clientRequest.pickup_description
                },
                "data" : {
                  "id_client_requets" : `${data[0].id}`,
                  "type" : 'CLIENT_REQUEST',
                },
                "android":{
                  "priority":"high",
                  "ttl": 180
                },
                "apns":{
                  "headers":{
                    "apns-priority":"5",
                    "apns-expiration":"180"
                  }
                }
            });
            return Number(data[0].id);
         } catch (error) {
             console.log('Error creando la solicitud del cliente', error);
             throw new HttpException('Error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
         }
     }

     async updateDriverAssigned(driverAssigned: UpdateDriverAssignedClientRequestDto) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    id_driver_assigned = ${driverAssigned.id_driver_assigned},
                   status = '${Status.ACCEPTED}',
                   updated_at = NOW(),
                   fare_assigned = ${driverAssigned.fare_assigned}
                WHERE
                    id = ${driverAssigned.id}
            `);
            
            return true;
        } catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new HttpException('Error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatus(updateStatusDto: UpdateStatusClientRequestDto) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    status = '${updateStatusDto.status}',
                    updated_at = NOW()
                WHERE
                    id = ${updateStatusDto.id_client_request}
            `);
            
            return true;
        } catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new HttpException('Error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateDriverRating(driverRating: UpdateDriverRatingDto) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    driver_rating = '${driverRating.driver_rating}',
                    updated_at = NOW()
                WHERE
                    id = ${driverRating.id_client_request}
            `);
            
            return true;
        } catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new HttpException('Error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

async updateClientRating(driverRating: UpdateClientRatingDto) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    client_rating = '${driverRating.client_rating}',
                    updated_at = NOW()
                WHERE
                    id = ${driverRating.id_client_request}
            `);
            
            return true;
        } catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new HttpException('Error del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    async getByClientRequest(id_client_request: number) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.pickup_position,
            CR.destination_position,
            CR.fare_assigned,
            CR.id_driver_assigned,
            JSON_OBJECT(
                "name", U.name,
                "lastname", U.lastname,
                "phone", U.phone,
                "image", U.image
            ) AS client,
            JSON_OBJECT(
                "name", D.name,
                "lastname", D.lastname,
                "phone", D.phone,
                "image", D.image
            ) AS driver,
            JSON_OBJECT(
                "brand", DCI.brand,
                "plate", DCI.plate,
                "color", DCI.color
            ) AS car     
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        LEFT JOIN
            users AS D
        ON
            D.id = CR.id_driver_assigned
        LEFT JOIN
            driver_car_info AS DCI
        ON
            DCI.id_driver = CR.id_driver_assigned
        WHERE
            CR.id = ${id_client_request} AND CR.status = '${Status.ACCEPTED}'
        `);
        return  {
            ...data[0],
            'pickup_lat': data[0].pickup_position.y,
            'pickup_lng': data[0].pickup_position.x,
            'destination_lat': data[0].destination_position.y,
            'destination_lng': data[0].destination_position.x,

        }; 
           
    }

    async getByDriverAssigned(id_driver: number) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.created_at,
            CR.pickup_position,
            CR.destination_position,
            CR.fare_assigned,
            CR.id_driver_assigned,
            CR.driver_rating,
            CR.client_rating,
            JSON_OBJECT(
                "name", U.name,
                "lastname", U.lastname,
                "phone", U.phone,
                "image", U.image
            ) AS client,
            JSON_OBJECT(
                "name", D.name,
                "lastname", D.lastname,
                "phone", D.phone,
                "image", D.image
            ) AS driver,
            JSON_OBJECT(
                "brand", DCI.brand,
                "plate", DCI.plate,
                "color", DCI.color
            ) AS car
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        LEFT JOIN
            users AS D
        ON
            D.id = CR.id_driver_assigned
        LEFT JOIN
            driver_car_info AS DCI
        ON
            DCI.id_driver = CR.id_driver_assigned
        WHERE
            CR.id_driver_assigned = ${id_driver} AND CR.status = '${Status.FINISHED}'
        `);
        return data;
    }

    async getByClientAssigned(id_client: number) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.created_at,
            CR.pickup_position,
            CR.destination_position,
            CR.fare_assigned,
            CR.id_driver_assigned,
            CR.driver_rating,
            CR.client_rating,
            JSON_OBJECT(
                "name", U.name,
                "lastname", U.lastname,
                "phone", U.phone,
                "image", U.image
            ) AS client,
            JSON_OBJECT(
                "name", D.name,
                "lastname", D.lastname,
                "phone", D.phone,
                "image", D.image
            ) AS driver,
            JSON_OBJECT(
                "brand", DCI.brand,
                "plate", DCI.plate,
                "color", DCI.color
            ) AS car
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        LEFT JOIN
            users AS D
        ON
            D.id = CR.id_driver_assigned
        LEFT JOIN
            driver_car_info AS DCI
        ON
            DCI.id_driver = CR.id_driver_assigned
        WHERE
            CR.id_client = ${id_client} AND CR.status = '${Status.FINISHED}'
        `);
        return data;
    }


     async getNearbyTripRequest(driver_lat: number, driver_lng: number) {
        const data = await this.clientRequestsRepository.query(`
             SELECT
                 CR.id,
                 CR.id_client,
                 CR.fare_offered,
                 CR.pickup_description,
                 CR.destination_description,
                 CR.status,
                 CR.updated_at,
                 CR.pickup_position,
                 CR.destination_position,
                 ST_Distance_Sphere(pickup_position, ST_GeomFromText('POINT(${driver_lat} ${driver_lng})', 4326)) AS distance,
                 timestampdiff(MINUTE, CR.updated_at, NOW()) AS time_difference,
             JSON_OBJECT(
                 "name", U.name,
                 "lastname", U.lastname,
                 "phone", U.phone,
                 "image", U.image
             ) AS client
             FROM 
                 client_requests AS CR
             INNER JOIN
                 users AS U
             ON
                 U.id = CR.id_client
             WHERE
                 timestampdiff(MINUTE, CR.updated_at, NOW()) < 9000 AND CR.status = '${Status.CREATED}'
             HAVING
                 distance < 60000
             `);
             if(data.length > 0) {
                 const pickup_positions = data.map(d => ({ 
                     lat: d.pickup_position.y, 
                     lng: d.pickup_position.x 
                }));
                 const googleResponse = await this.distancematrix({
                     params: {
                         mode: TravelMode.driving,
                         key: API_KEY,
                         origins: [
                             {
                                 lat: driver_lat,
                                 lng: driver_lng
                             }
                         ],
                         destinations: pickup_positions
                     }
             });
        
                 data.forEach((d, index) => {
                     d.google_distance_matrix = googleResponse.data.rows[0].elements[index];
                 });      
             }
             return data;
        }


    async getTimeAndDistanceClientRequest(
        origin_lat: number, 
        origin_lng: number, 
        destination_lat: number, 
        destination_lng: number
    ){
        const values = await this.timeAndDistanceValuesService.find();
        const kmValue = values[0].km_value;
        const minValue = values[0].min_value;
        const googleResponse = await this.distancematrix({
            params: {
                mode: TravelMode.driving,
                key: API_KEY,
                origins:[
                    {
                        lat: origin_lat,
                        lng: origin_lng
                    }
                ],
                destinations: [
                    {
                        lat: destination_lat,
                        lng: destination_lng
                    }
                ]
            } 

        });
        const recommendedValue = (kmValue * (googleResponse.data.rows[0].elements[0].distance.value / 1000)) + (minValue * (googleResponse.data.rows[0].elements[0].duration.value / 60))
        return {
            'recommended_value': recommendedValue,
            'destination_addresses': googleResponse.data.destination_addresses[0],
            'origin_addresses': googleResponse.data.origin_addresses[0],
            'distance': {
                'text': googleResponse.data.rows[0].elements[0].distance.text,
                'value': (googleResponse.data.rows[0].elements[0].distance.value / 1000)
            },
            'duration': {
                'text': googleResponse.data.rows[0].elements[0].duration.text,
                'value': (googleResponse.data.rows[0].elements[0].duration.value / 60)
            },
        }
    }

    
}
