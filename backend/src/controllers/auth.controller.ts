import { sign } from "../lib/jwt.js";
import * as authService from "../services/auth.service.js";
import { compare, hash } from "../lib/bcrypt.js";
import type { Request, Response } from "express";
import { safeUserSchema, type LoginBody, type SafeUser, type SignupBody } from 'super-chat-shared/auth';
import { AppError } from "@/errors/appError.ts";
import type { GetCheckResponse, PostLoginResponse, PostSignupResponse } from 'super-chat-shared/api';
import { isUniqueConstraintError } from "@/utils/prismaErrors.ts";



type LoginRequest = Request<{}, {}, LoginBody, {}>
export async function login(req: LoginRequest, res: Response<PostLoginResponse>) {

    const user = await authService.getUserByEmail(req.body.email);

    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const originalPassword = user.password;

    const result = await compare(req.body.password, originalPassword)
    if (!result) {
        throw new AppError(401, "Invalid credentials");
    }

    await sign(user, res);

    const safeUser = safeUserSchema.parse(user);

    res.status(201).json({ user: safeUser });

}
type SignupRequest = Request<{}, {}, SignupBody, {}>

export async function signup(req: SignupRequest, res: Response<PostSignupResponse>) {

    let user: SafeUser;
    const password = await hash(req.body.password);
    try {
        user = await authService.insertUser({ ...req.body, password });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new AppError(409, "Email already exists");
        }
        throw error;
    }

    await sign(user, res);
    const safeUser = safeUserSchema.parse(user);
    res.status(201).json({ user: safeUser });
}

export async function check(req: Request, res: Response<GetCheckResponse>) {
    const userId = res.locals.userId;
    const user = await authService.getUserById(userId);
    if (!user) {
        res.clearCookie("jwt");
        return res.json({ user: null });
    }
    const safeUser = safeUserSchema.parse(user);
    return res.json({ user: safeUser });
}

export async function logout(req: Request, res: Response) {
    res.clearCookie("jwt");
    return res.json({ user: null });
}