import { verify } from "../utils/jwt.js";
import type { Response, Request, NextFunction } from "express"
export default async function protect(req: Request, res: Response, next: NextFunction) {
    try {
        const jwt = req.cookies?.jwt;
        if (!jwt) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        let payLoad = await verify(jwt);
        if (!payLoad) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.userId = payLoad.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}