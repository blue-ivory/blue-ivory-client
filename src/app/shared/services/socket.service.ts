import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from "environments/environment";

@Injectable()
export class SocketService {
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io(environment.server_url);
    }
}