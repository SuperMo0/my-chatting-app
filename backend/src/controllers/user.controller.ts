import * as userService from '@/services/user.service.ts';
import type { Request, Response } from 'express';
import type { PutUpdateProfileResponse } from 'super-chat-shared/api';
import type { SafeUser } from 'super-chat-shared/auth';
import type { UpdateProfileBody } from 'super-chat-shared/user';

type UpdateProfileRequest = Request<{}, {}, UpdateProfileBody, {}>

export async function updateProfile(req: UpdateProfileRequest, res: Response<PutUpdateProfileResponse>) {
    const userId = res.locals.userId;
    const user = await userService.updateProfile(req.body, userId);
    return res.json({ user });
}