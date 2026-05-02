import type { UpdateProfileBody } from "super-chat-shared/user";
import prisma from '@/lib/prisma.js';
import { safeUserSelection } from "./auth.service.ts";

export async function updateProfile(profile: UpdateProfileBody, userId: string) {

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...(profile.name && { name: profile.name }),
            ...(profile.avatar && { avatar: profile.avatar })
        },
        select: safeUserSelection
    });
    return result;



}