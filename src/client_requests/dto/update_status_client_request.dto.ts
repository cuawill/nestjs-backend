import { Status } from "src/time_and_distance_values/client_requests.entity";

export class UpdateStatusClientRequestDto {
    id_client_request: number;
    status: Status;    
}