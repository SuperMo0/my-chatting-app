import { sign } from "../utils/jwt.js";
import * as model from "../models/auth.model.js"
import { compare, hash } from "../utils/bcrypt.js";
import type { Request, Response } from "express";
import type { UserLogin, UserSignup } from "../../Shared/auth-type.js";
import { UserLoginSchema, UserSignupSchema, UserOutSchema } from "../../Shared/auth-type.js";


function isUniqueConstraintError(error: unknown): error is { code: string } {
    return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}



export async function login(req: Request<{}, {}, UserLogin>, res: Response) {

    const parseResult = UserLoginSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input" });
    }

    let user = await model.getUserByEmail(parseResult.data.email);

    if (!user) {
        return res.status(401).json({ message: "wrong credentials" })
    }

    let originalPassword = user.password;

    let result = await compare(parseResult.data.password, originalPassword)
    if (!result) {
        return res.status(401).json({ message: "wrong credentials" })
    }

    await sign(user, res);
    res.status(201).json({ user: UserOutSchema.parse(user) });

}

export async function signup(req: Request<{}, {}, UserSignup, {}>, res: Response) {

    const parseResult = UserSignupSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input" });
    }
    let { name, email, password } = parseResult.data;
    let user;
    password = await hash(password);
    try {
        user = await model.insertUser(name, email, password);
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            return res.status(409).json({ message: "Email already exists" });
        }
        throw error;
    }

    await sign(user, res);
    res.status(201).json({ user });
}

export async function check(req: Request, res: Response) {
    let user = await model.getUserById(req.userId);
    return res.json({ user });
}

export async function logout(req: Request, res: Response) {
    res.clearCookie("jwt");
    return res.json({ message: 'ok' });
}