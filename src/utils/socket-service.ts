import * as socketio from 'socket.io';
import * as http from 'http';

class WarehouseSoocket {
  public io: socketio.Server;
  public socket: socketio.Socket;
  constructor() {
  }
  public startConnection(server: http.Server) {
    this.io = new socketio.Server(server, {
      cors: {
        origin: ['http://localhost:4000', 'https://mallina.netlify.app'],
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: socketio.Socket) => {
      this.socket = socket;
      console.log("connection yest")
      this.socket.emit('aaa', 'asdasas')
      this.registerEvents();
    });
  }
  public sendScannedInfo(message: string) {
    this.socket.emit('update-scanned-info', message)
  }
  
  
  public registerEvents() {
    this.socket.on('some-message', (message: string) => {
      console.log('message', message);
    });
  }
}

export default WarehouseSoocket;
