import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });
  }

  onOrderCreated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderCreated', (data: any) => {
        observer.next(data);
      });
    });
  }

  onOrderUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderUpdated', (data: any) => {
        observer.next(data);
      });
    });
  }
} 