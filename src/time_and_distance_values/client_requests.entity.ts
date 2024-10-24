import { Point } from "geojson";
import { DriverTripOffers } from "src/driver_trip_offers/driver_trip_offers.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    CREATED = 'CREATED',
    ACCEPTED = 'ACCEPTED',
    ON_THE_WAY = 'ON_THE_WAY',
    ARRIVED = 'ARRIVED',
    TRAVELLING = 'TRAVELLING',
    FINISHED = 'FINISHED',
    CANCELLED = 'CANCELLED'
}


@Entity({name: 'client_requests'})
export class ClientRequests {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_client: number;

    @Column('decimal', {precision: 10, scale: 2})
    fare_offered: number;

    @Column()
    pickup_description: string;

    @Column()
    destination_description: string;


    @Column({ nullable: true })
    id_driver_assigned: number;

    @Column({ nullable: true })
    fare_assigned: number;

    @Column('decimal', { nullable: true, precision: 5, scale: 2 })
    client_rating: number;

    @Column('decimal', { nullable: true, precision: 5, scale: 2 })
    driver_rating: number;

    @Index({ spatial: true })
    @Column({
        type: 'point',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false
    })
    pickup_position: Point;


    @Index({ spatial: true })
    @Column({
        type: 'point',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false
    })
    destination_position: Point;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.CREATED
    })
    status: Status

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_client' })
    user: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_driver_assigned' })
    driverAssigned: User;
    
    @OneToMany(() => DriverTripOffers, driverTripOffers => driverTripOffers.id_client_request,{
        cascade: true
    })
    driverTripOffers: DriverTripOffers;
}