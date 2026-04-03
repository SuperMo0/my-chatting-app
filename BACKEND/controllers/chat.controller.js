import { getReceivers } from '../utils/utils.js';
import * as model from '../models/chat.model.js'
import { io } from '../lib/socket.js';
export async function getUserFriends(req, res) {
    let friends = await model.getUserFriends(req.userId);
    res.json({ friends });
}
export async function getUserChats(req, res) {
    let chats = await model.getUserChats(req.userId);
    res.json({ chats });

}


export async function getChatMessages(req, res) {
    const { chatId } = req.params;
    const { before, limit } = req.query;

    let { messages, hasMore } = await model.getChatMessages(
        chatId,
        before,
        parseInt(limit) || 20
    );

    res.json({ messages, hasMore });
}

export async function getUserFriendsRequestsTo(req, res) {
    const userId = req.userId
    let requestsTo = await model.getUserFriendsRequestsTo(userId);
    res.json({ requestsTo });
}

export async function getUserFriendsRequestsBy(req, res) {
    const userId = req.userId
    let requestsBy = await model.getUserFriendsRequestsBy(userId);
    res.json({ requestsBy });
}

export async function markChatAsRead(req, res) {
    const userId = req.userId;

    const { chatId } = req.params;

    let chat = await model.markChatAsRead(chatId, userId);

    res.json({ message: 'ok' });

    const receivers = getReceivers(userId, chat);

    receivers.forEach((receiver) => {
        io.to(receiver.id).emit("chatIsRead", chat);
    })
}


export async function createFriendReqesut(req, res) {
    const userId = req.userId;

    const { receiverId } = req.params;

    let request = await model.createFriendRequest(userId, receiverId);

    res.status(201).json({ request });

    io.to(receiverId).emit("requestsToUserUpdate", request);
}

export async function acceptFriendRequest(req, res) {
    const userId = req.userId; // make sure that the current user is the reciever of the request 

    const { requestId } = req.params;

    const [sender, receiver, chat] = await model.acceptFriendRequest(requestId)

    res.json({ message: 'success' });

    io.to(sender.id).emit("friendsUpdate", receiver);

    io.to(receiver.id).emit("friendsUpdate", sender);

    io.to(sender.id).emit("chatUpdate", chat);

    io.to(receiver.id).emit("chatUpdate", chat);
}

export async function createNewMessage(req, res) {
    const userId = req.userId;
    const { chatId } = req.params;
    const { content } = req.body

    const message = await model.createNewMessage(chatId, userId, content);

    const chat = await model.updateChatLastMessage(chatId, message)

    chat.users.forEach(user => {
        io.to(user.id).emit("chatUpdate", chat);
    });

    res.status(201).json({ message: 'ok' });
}

export async function getAllUsers(req, res) {
    const users = await model.getAllUsers(req.userId);
    res.json({ users });
}
