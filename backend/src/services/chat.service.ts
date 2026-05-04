import prisma from '../lib/prisma.js';
import { Prisma } from '../../generated/prisma/index.js';
import type { NewMessageBody } from 'super-chat-shared/chat';
import { AppError } from '@/errors/appError.ts';

const safeUserSelection = {
    name: true,
    avatar: true,
    id: true,
} satisfies Prisma.userSelect;

export async function getUserFriends(userId: string) {
    const result = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            friendsTo: { select: safeUserSelection },
        }
    });

    const finalResult = result?.friendsTo || [];
    return finalResult;
}

export async function getUserChats(userId: string) {
    const result = await prisma.chat.findMany({
        where: { users: { some: { id: userId } } },
        include: {
            users: { select: safeUserSelection },
            lastMessage: true
        },
        orderBy: {
            lastMessage: {
                timestamp: 'desc'
            }
        }
    });
    return result;
}


export async function getFriendRequestsToUser(userId: string) {
    const result = await prisma.request.findMany({
        where: { receiverId: userId },
        include: { sender: { select: safeUserSelection } }
    })
    return result;
}

export async function getFriendRequestsByUser(userId: string) {
    const result = await prisma.request.findMany({
        where: { senderId: userId },
        include: { receiver: { select: safeUserSelection } }
    })
    return result;
}

export async function createFriendRequest(senderId: string, receiverId: string) {

    const result = await prisma.request.create({
        data: {
            senderId,
            receiverId
        },
        include: {
            sender: { select: safeUserSelection },
            receiver: { select: safeUserSelection }
        }
    })
    return result;
}


export async function acceptFriendRequest(requestId: string, receiverId: string) {
    const request = await prisma.request.findUnique({
        where: { id: requestId }
    });

    if (!request) {
        throw new Error("Request not found");
    }

    if (request.receiverId !== receiverId) {
        throw new AppError(403, "You are not allowed to accept this friend request");
    }

    const [sender, receiver, chat] = await prisma.$transaction([
        prisma.user.update({
            where: { id: request.senderId },
            data: { friendsTo: { connect: { id: request.receiverId } } },
            select: safeUserSelection
        }),
        prisma.user.update({
            where: { id: request.receiverId },
            data: { friendsTo: { connect: { id: request.senderId } } },
            select: safeUserSelection
        }),
        prisma.chat.create({
            data: {
                users: {
                    connect: [{ id: request.senderId }, { id: request.receiverId }]
                }
            },
            include: {
                users: { select: safeUserSelection },
                lastMessage: true
            }
        }),
        prisma.request.delete({
            where: { id: requestId }
        })
    ]);

    return [sender, receiver, chat] as const;
}


export async function createNewMessage(chatId: string, senderId: string, message: NewMessageBody) {

    const result = await prisma.$transaction(async () => {

        const newMessage = await prisma.message.create({
            data: {
                content: message.content,
                senderId,
                chatId
            }
        });

        const chat = await prisma.chat.update({
            where: { id: chatId },
            data: { lastMessageId: newMessage.id },
            include: {
                users: { select: safeUserSelection },
                lastMessage: true
            }
        });

        return [newMessage, chat] as const;
    });

    return result;
}

export function getAllUsers() {
    const result = prisma.user.findMany({
        select: safeUserSelection
    });
    return result;
}

// todo: we need to use uuid Version 7 for this function to work.
export async function getChatMessages(chatId: string, cursor: string | null, limit: number) {

    const result = await prisma.message.findMany({
        where: {
            chatId,
        },
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
        }),
        orderBy: [
            { timestamp: 'desc' },
            { id: 'desc' },
        ],
        take: limit,
    });

    const nextCursor = result.length === limit ? result[result.length - 1]!.id : null;
    return [result, nextCursor] as const;
}

export async function markMessageAsRead(messageId: string, userId: string) {
    const result = await prisma.message.update({
        where: { id: messageId },
        data: {
            isRead: true
        },
        include: {
            sender: { select: safeUserSelection }
        }
    });
    return result;
}   