import prisma from '../lib/prisma.js';
import type { SignupBody } from 'super-chat-shared/auth';
import { Prisma } from '../../generated/prisma/index.js';

export const safeUserSelection = {
    id: true,
    name: true,
    avatar: true,
} satisfies Prisma.userSelect;

export async function insertUser(user: SignupBody) {
    const result = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password,
            chats: {
                connectOrCreate: {
                    create: {
                        id: "1",
                        name: 'global'
                    },
                    where: {
                        id: "1"
                    }
                }
            }
        },
        select: safeUserSelection
    });
    return result;
}

export async function getUserByEmail(email: string) {
    const result = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    return result;
}

export async function getUserById(id: string) {
    const result = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: safeUserSelection
    });
    return result;
}
