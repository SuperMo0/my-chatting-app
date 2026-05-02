import { Router } from "express";
import protect from '../middlewares/protect.js'
import * as controller from '../controllers/chat.controller.js'
import { validateBody } from "@/middlewares/validateBody.ts";
import { validateParams } from "@/middlewares/validateParams.ts";
import { z } from "zod";
import { NewMessageBodySchema } from "super-chat-shared/chat";

export const createFriendRequestParamsSchema = z.object({
    receiverId: z.string()
})

export const createNewMessageParamsSchema = z.object({
    chatId: z.string()
})

export const acceptFriendRequestParamsSchema = z.object({
    requestId: z.string()
})

export const markMessageAsReadParamsSchema = z.object({
    messageId: z.string()
})
const router = Router();

router.use(protect)

router.get('/friends',
    controller.getUserFriends);

router.get('/users',
    controller.getAllUsers);

router.get('/chats',
    controller.getUserChats);

router.get('/chat/:chatId/messages',
    controller.getChatMessages);

router.get('/requests/to',
    controller.getUserFriendsRequestsTo);

router.get('/requests/by',
    controller.getUserFriendsRequestsBy);

router.post('/request/:receiverId',
    validateParams(createFriendRequestParamsSchema),
    controller.createFriendRequest);

router.post('/message/:chatId',
    validateParams(createNewMessageParamsSchema),
    validateBody(NewMessageBodySchema),
    controller.createNewMessage);

router.put('/request/:requestId',
    validateParams(acceptFriendRequestParamsSchema),
    controller.acceptFriendRequest);

router.put('/message/:messageId/read',
    validateParams(markMessageAsReadParamsSchema),
    controller.markMessageAsRead);



export default router


