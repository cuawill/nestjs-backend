import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'time_and_distance_values' })
export class TimeAndDistanceValues {

     @PrimaryGeneratedColumn()
     id: number;

     @Column('decimal', { precision: 10, scale: 2 })
     km_value: number;

     @Column('decimal', { precision: 10, scale: 2 })
     min_value: number;

}