import { Entity, PrimaryGeneratedColumn,Column, BeforeInsert, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { hash } from 'bcrypt';
import { Rol } from "src/roles/rol.entity";
import { DriversPosition } from "src/drivers_position/drivers_position.entity";
import { ClientRequests } from "src/time_and_distance_values/client_requests.entity";
import { DriverTripOffers } from "src/driver_trip_offers/driver_trip_offers.entity";
import { DriverCarInfo } from "src/driver_car_info/driver_car_info.entity";

@Entity({ name: 'users' })
export class User {
//create table users(id,name,lastname,email,phone,image,password,notification_token,created_at,updated_at)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;
    
    @Column({ unique: true })
    phone: string;
    
    @Column({ nullable: true })
    image: string;
    
    @Column()
    password: string;

    @Column({ nullable: true })
    notification_token: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }
    })

    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[];

    @OneToMany(() => DriversPosition, driversPosition => driversPosition.id_driver)
    driversPosition: DriversPosition;

    @OneToMany(() => ClientRequests, clientRequests => clientRequests.id_client)
    clientRequests: ClientRequests;

    @OneToMany(() => ClientRequests, clientRequests => clientRequests.id_driver_assigned)
    clientRequestsDriverAssigned: ClientRequests;

    @OneToMany(() => DriverTripOffers, driverTripOffers => driverTripOffers.id_driver)
    driverTripOffers: DriverTripOffers;

    @OneToMany(() => DriverCarInfo, driverCarInfo => driverCarInfo.id_driver)
    driverCarInfo: DriverCarInfo;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }

}