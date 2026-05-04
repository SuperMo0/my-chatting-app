import type { UpdateProfileBody } from "super-chat-shared/user";
import prisma from '@/lib/prisma.js';
import { safeUserSchema } from "super-chat-shared/auth";

export async function updateProfile(profile: UpdateProfileBody, userId: string) {

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...(profile.name && { name: profile.name }),
            ...(profile.avatar && { avatar: profile.avatar })
        }
    });

    const safeUser = safeUserSchema.parse(result);
    return safeUser;
}