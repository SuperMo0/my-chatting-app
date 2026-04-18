import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string; // Use '?' because it's only there after 'protect' runs
        }
    }
}