import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import { Message, MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseRepository {
    messaging: Messaging;
  
  #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.messaging = firebaseApp.messaging();
  }

  endMessage(notification: Message) {
    this.messaging.send(notification).then((response) => {
        console.log('NOTIFICACION ENVIADA');
    }).catch(e => {
        console.log('ERROR ENVIANDO NOTIFICACION: ', e);
    })
  }
  sendMessageToMultipleDevices(notification: MulticastMessage) {
    this.messaging.sendEachForMulticast(notification).then((response) => {
        console.log('NOTIFICACION ENVIADA');
    }).catch(e => {
        console.log('ERROR ENVIANDO NOTIFICACION: ', e);
    })
  }
}