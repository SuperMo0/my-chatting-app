import { sign, verify } from "../utils/jwt.js";
import * as model from "../models/auth.model.js"
import { compare, hash } from "../utils/bcrypt.js";
import type { Request, Response } from "express";
import type { UserLogin, UserSignup } from "../../Shared/auth-type.js";
import { UserLoginSchema, UserSignupSchema, UserOutSchema } from "../../Shared/auth-type.js";



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
        return res.status(401).json({ message: "Email already Exists" })
    }

    await sign(user, res);
    res.status(201).json({ user });
}

export async function check(req: Request, res: Response) {
    try {
        const jwt = req.cookies?.jwt;
        if (!jwt) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const payload = await verify(jwt);

        if (!payload.userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        let user = await model.getUserById(payload.userId);
        return res.json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie("jwt");
        return res.json({ message: 'ok' });
    } catch (error) {
        return res.status(401).json({ message: "error please try again" });
    }
}