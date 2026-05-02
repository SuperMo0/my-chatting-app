import prisma from '../lib/prisma.js';
import { Prisma } from '../../generated/prisma/index.js';

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
        }
    });
    return result;
}
