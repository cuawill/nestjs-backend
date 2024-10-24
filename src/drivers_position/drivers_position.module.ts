import { Module } from '@nestjs/common';
import { DriversPositionService } from './drivers_position.service';
import { DriversPositionController } from './drivers_position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversPosition } from './drivers_position.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ DriversPosition, User ]) ],
  providers: [DriversPositionService],
  controllers: [DriversPositionController]
})
export class DriversPositionModule {}
