import { Router } from "express";
import * as controller from '@/controllers/auth.controller.ts'
import protect from '@/middlewares/protect.ts'
import { validateBody } from "@/middlewares/validateBody.ts";
import { loginBodySchema, signupBodySchema } from "super-chat-shared/auth";


const router = Router();

router.post('/login', validateBody(loginBodySchema), controller.login);

router.post('/signup', validateBody(signupBodySchema), controller.signup);

router.post('/logout', controller.logout);

router.get('/check', protect, controller.check);


export default router



