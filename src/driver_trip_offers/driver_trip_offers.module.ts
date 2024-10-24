import { Module } from '@nestjs/common';
import { DriverTripOffersService } from './driver_trip_offers.service';
import { DriverTripOffersController } from './driver_trip_offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTripOffers } from './driver_trip_offers.entity';
import { User } from 'src/users/user.entity';
import { ClientRequests } from 'src/time_and_distance_values/client_requests.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([DriverTripOffers, User, ClientRequests]) ],
  providers: [DriverTripOffersService],
  controllers: [DriverTripOffersController]
})
export class DriverTripOffersModule {}
