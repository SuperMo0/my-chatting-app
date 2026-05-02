import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "super-chat-shared/socket";
import type { Socket } from "socket.io";

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
