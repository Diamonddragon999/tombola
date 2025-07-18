import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  connect() {
    if (this.socket) return this.socket;
    
    this.socket = io();
    
    this.socket.on('connect', () => {
      // connected
      console.log('Connected to server');
    });
    
    this.socket.on('disconnect', () => {
      // disconnected
      console.log('Disconnected from server');
    });
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
  
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketManager = new SocketManager();