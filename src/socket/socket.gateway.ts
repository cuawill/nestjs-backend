import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { Client } from "socket.io/dist/client";
@WebSocketGateway({
    cors: {
        origin: '*'
    },
    transports: ['websocket']
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;
    handleDisconnect(client: Socket) {
        console.log("Un usuario se ha desconectado de SOCKET.IO", client.id);
        this.server.emit('driver_disconnected', { id_socket: client.id });
    }
    handleConnection(client: Socket, ...args: any[]) {
        console.log("Un usuario se ha conectado a SOCKET.IO", client.id);
     }

     @SubscribeMessage('message')
     handleMessage(@MessageBody() data: any){
        console.log('Nuevo mensaje', data);
        this.server.emit('new_message','Bien gracias');
        }

    @SubscribeMessage('change_driver_position')
    handleChangeDriverPosition(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log('Nueva posicion: ', data);   
        this.server.emit('new_driver_position', { id_socket:client.id, id:  data.id, lat: data.lat, lng: data.lng });
    }
    @SubscribeMessage('new_client_request')
    handleNewClientRequest(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log('ID CLIENT REQUEST:',  data.id_client_request)
         this.server.emit('created_client_request', { id_socket: client.id, id_client_request: data.id_client_request });
    }
    @SubscribeMessage('new_driver_offer')
    handleNewDriverOffer(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log('ID CLIENT REQUEST DRIVER OFFER:', data.id_client_request);
        this.server.emit(`created_driver_offer/${data.id_client_request}`, { id_socket: client.id });
    }
    @SubscribeMessage('new_driver_assigned')
    handleNewDriverAssigned(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        this.server.emit(`driver_assigned/${data.id_driver}`, { id_socket: client.id, id_client_request: data.id_client_request });
    }
    @SubscribeMessage('trip_change_driver_position')
    handleTripChangeDriverPosition(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        this.server.emit(`trip_new_driver_position/${data.id_client}`, { id_socket: client.id, lat: data.lat, lng: data.lng });
    }
    @SubscribeMessage('update_status_trip')
    handleUpdateStatusTrip(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        this.server.emit(`new_status_trip/${data.id_client_request}`, { id_socket: client.id, status: data.status, id_client_request: data.id_client_request });
    }
} 