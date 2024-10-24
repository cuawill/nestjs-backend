import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeAndDistanceValues } from './time_and_distance_values.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimeAndDistanceValuesService {
    constructor(@InjectRepository(TimeAndDistanceValues) private timeAndDistanceValuesRepository: Repository<TimeAndDistanceValues>) {}

    find() {
        return this.timeAndDistanceValuesRepository.find({ where: { id: 1 } });
    }
}
