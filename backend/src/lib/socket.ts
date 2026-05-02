import { Server } from "socket.io";
import express from 'express'
import http from 'http'
import { verify } from '@/lib/jwt.js'
import * as cookie from 'cookie'
import { AppError } from "@/errors/appError.ts";
import type {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData
} from 'super-chat-shared/socket';



const app = express();
const server = http.createServer(app);

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
})


const onlineUsers: { [key: string]: number } = { "1": 1 };

io.use(async (socket, next) => {
    try {
        const cookiesHeader = socket.handshake.headers.cookie || '';
        const cookies = cookie.parse(cookiesHeader);
        if (!cookies.jwt) {
            return next(new AppError(401, "Authentication error: No token provided"));
        }
        const token = cookies.jwt;
        const payload = await verify(token);
        socket.data.userId = payload.userId;
        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new AppError(401, "Authentication error"));
        socket.disconnect();
    }
});


io.on('connection', async (socket) => {
    const userId = socket.data.userId;
    if (!onlineUsers[userId]) onlineUsers[userId] = 0;
    onlineUsers[userId]++;
    socket.join(userId);

    socket.on('disconnect', () => {
        if (onlineUsers[userId]) {
            onlineUsers[userId]--;
            if (onlineUsers[userId] === 0) delete onlineUsers[userId];
        }
        io.emit('onlineUsersListChangeEvent');
        console.log(`🔴socket disconnect current online: ${io.engine.clientsCount}`);
    })
    io.emit('onlineUsersListChangeEvent');

    console.log(`✅new socket connection current online: ${io.engine.clientsCount}`);
})


export { io, app, server };