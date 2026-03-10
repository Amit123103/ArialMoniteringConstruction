import { Server } from 'socket.io';

let io = null;

export const initWebSocketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Depending on environment, might want to restrict this
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New WebSocket (Socket.io) connection established:', socket.id);

        socket.on('CV_STREAM_UPDATE', (data) => {
            // Broadcast to all other clients
            socket.broadcast.emit('LIVE_CV_STATS', data);
        });

        socket.on('disconnect', () => {
            console.log('WebSocket client disconnected:', socket.id);
        });
    });

    console.log('Socket.io Server Ready');
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
