import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverCarInfo } from './driver_car_info.entity';
import { Repository } from 'typeorm';
import { CreateDriverCarInfoDto } from './dto/create_driver_car_info.dto';

@Injectable()
export class DriverCarInfoService {
    constructor(@InjectRepository(DriverCarInfo) private driverCarInfoRepository: Repository<DriverCarInfo>) {}

    async create(driverCarInfo: CreateDriverCarInfoDto) {
        const carInfoFound = await this.driverCarInfoRepository.findOneBy({id_driver: driverCarInfo.id_driver});
        if (!carInfoFound) {
            const newCarInfo = this.driverCarInfoRepository.create(driverCarInfo);
            return this.driverCarInfoRepository.save(newCarInfo);
        }
        const updatedCarInfo = Object.assign(carInfoFound, driverCarInfo);
        return this.driverCarInfoRepository.save(updatedCarInfo);
    }
    findByIdDriver(id_driver: number) {
        return this.driverCarInfoRepository.findOneBy({ id_driver: id_driver });
    }
}
