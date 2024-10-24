import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/jwt/jwt.constants';
//import { jwtConstants } from './constants';
import { RolesModule } from './roles/roles.module';
import { SocketModule } from './socket/socket.module';
import { DriversPositionModule } from './drivers_position/drivers_position.module';
import { ClientRequestsModule } from './client_requests/client_requests.module';
import { TimeAndDistanceValuesModule } from './time_and_distance_values/time_and_distance_values.module';
import { DriverTripOffersModule } from './driver_trip_offers/driver_trip_offers.module';
import { DriverCarInfoModule } from './driver_car_info/driver_car_info.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'db_rvs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({ cache: true }),
    UsersModule,
    AuthModule,
    RolesModule,
    SocketModule,
    DriversPositionModule,
    ClientRequestsModule,
    TimeAndDistanceValuesModule,
    DriverTripOffersModule,
    DriverCarInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
