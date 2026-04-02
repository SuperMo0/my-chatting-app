import "dotenv/config";
import express from 'express'
import authRouter from './routes/auth.router.js'
import chatRouter from './routes/chat.router.js'
import userRouter from './routes/user.router.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { io, app, server } from './lib/socket.js'
import path from "path";


if (process.env.NODE_ENV === "development") {
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }))
}

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/app', chatRouter);

app.use('/api/user', userRouter);

if (process.env.NODE_ENV == "production") {

    let dist = path.join(process.cwd(), '/../FRONTEND/dist');
    app.use(express.static(dist));
    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(dist, '/index.html'));
    })
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server is listening on port:${PORT}`);
})
