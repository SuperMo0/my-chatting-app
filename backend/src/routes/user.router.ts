import { Router } from "express";
import protect from '../middlewares/protect.js'
import * as controller from '../controllers/user.controller.js'
import { validateBody } from "@/middlewares/validateBody.ts";
import { updateProfileBodySchema } from 'super-chat-shared/user';

const router = Router();

router.use(protect);

router.put('/', validateBody(updateProfileBodySchema), controller.updateProfile)


export default router