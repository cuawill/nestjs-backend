import { Module } from '@nestjs/common';
import { ClientRequestsService } from './client_requests.service';
import { ClientRequestsController } from './client_requests.controller';
import { TimeAndDistanceValuesService } from 'src/time_and_distance_values/time_and_distance_values.service';
import { TimeAndDistanceValuesModule } from 'src/time_and_distance_values/time_and_distance_values.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRequests } from 'src/time_and_distance_values/client_requests.entity';
import { User } from 'src/users/user.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';


@Module({
  providers: [ClientRequestsService],
  controllers: [ClientRequestsController],
  imports: [TimeAndDistanceValuesModule,TypeOrmModule.forFeature([ClientRequests, User]), FirebaseModule]
})  

export class ClientRequestsModule {}
