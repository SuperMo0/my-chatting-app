import * as chatService from '../services/chat.service.js';
import type { Request, Response } from "express";
import type {
    GetUserFriendsResponse,
    GetUserChatsResponse,
    GetUserFriendsRequestsToResponse,
    GetUserFriendsRequestsByResponse,
    CreateFriendRequestResponse,
    AcceptFriendRequestResponse,
    CreateNewMessageResponse,
    GetAllUsersResponse,
    GetChatMessagesResponse,
    MarkMessageAsReadResponse
} from 'super-chat-shared/api';
import type { AppSocket } from '@/types/appSocket.ts';
import type { NewMessageBody } from 'super-chat-shared/chat';


export async function getUserFriends(req: Request, res: Response<GetUserFriendsResponse>) {
    const userId = res.locals.userId;
    let friends = await chatService.getUserFriends(userId);
    res.json({ friends });
}


export async function getUserChats(req: Request, res: Response<GetUserChatsResponse>) {
    const userId = res.locals.userId;
    let chats = await chatService.getUserChats(userId);
    res.json({ chats });
}


export async function getUserFriendsRequestsTo(req: Request, res: Response<GetUserFriendsRequestsToResponse>) {
    const userId = res.locals.userId;
    let requestsTo = await chatService.getFriendRequestsToUser(userId);
    res.json({ requestsTo });
}


export async function getUserFriendsRequestsBy(req: Request, res: Response<GetUserFriendsRequestsByResponse>) {
    const userId = res.locals.userId;
    let requestsBy = await chatService.getFriendRequestsByUser(userId);
    res.json({ requestsBy });
}


type GetChatMessagesRequest = Request<{ chatId: string, }, {}, {}, { cursor: string }>
export async function getChatMessages(req: GetChatMessagesRequest, res: Response<GetChatMessagesResponse>) {
    const chatId = req.params.chatId;
    const cursor = req.query.cursor;
    let [messages, nextCursor] = await chatService.getChatMessages(chatId, cursor, 20);
    res.json({ messages, nextCursor });
}

type MarkMessageAsReadRequest = Request<{ messageId: string }>
export async function markMessageAsRead(req: MarkMessageAsReadRequest, res: Response<MarkMessageAsReadResponse>) {
    const messageId = req.params.messageId;
    const userId = res.locals.userId;

    const message = await chatService.markMessageAsRead(messageId, userId);
    res.json({ message });

    const io = req.app.get("io") as AppSocket;
    io.to(message.senderId).emit("messageIsReadEvent", message);
}


type createFriendRequestRequest = Request<{ receiverId: string }>
export async function createFriendRequest(req: createFriendRequestRequest, res: Response<CreateFriendRequestResponse>) {
    const userId = res.locals.userId;
    const receiverId = req.params.receiverId;

    const request = await chatService.createFriendRequest(userId, receiverId);
    res.status(201).json({ request });

    const io = req.app.get("io") as AppSocket;
    io.to(receiverId).emit("friendRequestsToUserListChangeEvent");
}


type AcceptFriendRequestRequest = Request<{ requestId: string }>
export async function acceptFriendRequest(req: AcceptFriendRequestRequest, res: Response<AcceptFriendRequestResponse>) {
    const userId = res.locals.userId;
    const requestId = req.params.requestId;

    const [sender, receiver, chat] = await chatService.acceptFriendRequest(requestId);

    res.json({ sender, chat });

    const io = req.app.get("io") as AppSocket;
    io.to(sender.id).emit("friendsListChangeEvent");
    io.to(receiver.id).emit("friendsListChangeEvent");
    io.to(sender.id).emit("userChatsChangeEvent");
    io.to(receiver.id).emit("userChatsChangeEvent");
}


type CreateNewMessageRequest = Request<{ chatId: string }, {}, NewMessageBody>
export async function createNewMessage(req: CreateNewMessageRequest, res: Response<CreateNewMessageResponse>) {
    const userId = res.locals.userId;
    const chatId = req.params.chatId;

    const [message, chat] = await chatService.createNewMessage(chatId, userId, req.body);

    res.status(201).json({ message, chat });

    const io = req.app.get("io") as AppSocket;
    chat.users.forEach(user => {
        if (user.id === userId) return;
        io.to(user.id).emit("userChatsChangeEvent");
    });
}

export async function getAllUsers(req: Request, res: Response<GetAllUsersResponse>) {
    const userId = res.locals.userId;
    const users = await chatService.getAllUsers();
    res.json({ users });
}
