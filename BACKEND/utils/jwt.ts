import type { Response } from 'express';
import { promisify } from 'util';
import * as jwt from 'jose'
import type { JWTPayload } from 'jose';



let SECRET = process.env.SECRET!
const Uint8Array_Secret = new TextEncoder().encode(SECRET);
type My = JWTPayload & { userId: string }
export async function sign(user: { id: string }, res: Response) {
    const token = await new jwt.SignJWT({ userId: user.id }).setProtectedHeader({ alg: 'HS256' }) // Required by jose
        .setIssuedAt().setExpirationTime('2 days').sign(Uint8Array_Secret);
    res.cookie("jwt", token, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "lax" })
}


export async function verify(token: string) {
    const { payload } = await jwt.jwtVerify<My>(token, Uint8Array_Secret);
    return payload;
}