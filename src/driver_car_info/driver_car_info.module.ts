import { Module } from '@nestjs/common';
import { DriverCarInfoService } from './driver_car_info.service';
import { DriverCarInfoController } from './driver_car_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverCarInfo } from './driver_car_info.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ DriverCarInfo, User ])],
  providers: [DriverCarInfoService],
  controllers: [DriverCarInfoController]
})
export class DriverCarInfoModule {}
