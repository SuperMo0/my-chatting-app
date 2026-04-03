import prisma from '../lib/prisma.js'




const userProfileSelect = {
    name: true,
    avatar: true,
    id: true,
}
export async function getUserFriends(userId) {
    try {
        let result = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                friendsTo: { select: userProfileSelect },
            }
        })
        return result.friendsTo

    } catch (error) {
        throw "error while getting user Friends"
    }
}

export async function getUserChats(userId) {
    try {
        let result = await prisma.user.findUnique({
            select: {
                chats: {
                    select: {
                        id: true,
                        lastMessage: true,
                        name: true,
                        users: {
                            select: userProfileSelect
                        }
                    }
                },
            },
            where: { id: userId },
        })
        return result.chats;
    } catch (error) {
        throw "error while gettin user chats"
    }
}

export async function getChatMessages(chatId) {
    try {
        let result = await prisma.message.findMany({
            where: { chatId: chatId },
            orderBy: { timestamp: 'asc' },
            include: { sender: { select: userProfileSelect } }

        })
        return result;

    } catch (error) {
        console.log(error);

        throw "error while getting chat messages"
    }

}
export async function getUserFriendsRequestsTo(userId) {
    try {
        let result = await prisma.request.findMany({
            where: { receiverId: userId },
            include: { sender: { select: userProfileSelect } }
        })
        return result;
    } catch (error) {
        throw "error while getting friends request sent to the user "
    }
}

export async function getUserFriendsRequestsBy(userId) {
    try {
        let result = await prisma.request.findMany({
            where: { senderId: userId }
        })
        return result;
    } catch (error) {
        throw "error while getting friends request sent by the user "
    }
}

export async function markMessageAsRead(messageId) {
    try {
        let result = await prisma.message.update({
            data: {
                isRead: true,
                readAt: new Date()
            },
            where: { id: messageId },
            include: { chat: true, sender: { select: userProfileSelect } }
        })
        return result;
    } catch (error) {
        console.log(error);

        throw "error marking message as read"
    }
}

export async function markChatAsRead(chatId, userId) {

    try {
        let result = await prisma.chat.update({
            data: {
                messages: {
                    updateMany: {
                        data: {
                            isRead: true,
                            readAt: new Date()
                        },
                        where: {
                            NOT: { senderId: userId },
                        }
                    }
                }
            },
            where: {
                id: chatId
            },
            include: {
                users: true,
                lastMessage: true,
            }

        })
        return result;

    } catch (error) {
        console.log(error);
        throw "error marking chat as read"
    }
}





export async function createFriendRequest(senderId, receiverId) {
    try {
        let result = await prisma.request.create({
            data: {
                senderId: senderId,
                receiverId: receiverId,
            },
            include: {
                sender: { select: userProfileSelect },
                receiver: { select: userProfileSelect },
            }

        })
        return result;
    } catch (error) {
        throw "error sending friend request"
    }
}

export async function acceptFriendRequest(requestId) {

    try {
        let request = await prisma.request.findUnique({
            where: { id: requestId }
        })

        if (!request) throw "request was not found"

        const { senderId, receiverId } = request;

        let [_, sender, receiver, chat] = await prisma.$transaction([
            prisma.request.delete({
                where: { id: requestId }
            }),
            prisma.user.update({
                data: { friendsTo: { connect: { id: receiverId } } },
                where: { id: senderId },
                select: userProfileSelect
            }),
            prisma.user.update({
                data: { friendsTo: { connect: { id: senderId } } },
                where: { id: receiverId },
                select: userProfileSelect
            }),
            prisma.chat.create({
                include: { users: { select: userProfileSelect } }
            })
        ])

        chat = await prisma.chat.update({
            data: {
                users: {
                    connect: [{ id: senderId }, { id: receiverId }]
                }
            },
            where: {
                id: chat.id,
            }
            , include: { users: { select: userProfileSelect } }
        })

        return [sender, receiver, chat]

    } catch (error) {
        console.log(error);
        throw "error accepting friends request"
    }
}

export async function createNewMessage(chatId, senderId, content) {
    try {
        let result = await prisma.message.create({
            data: {
                senderId: senderId,
                chatId: chatId,
                content: content,
                isRead: chatId == "1",
            },
        })
        return result;
    } catch (error) {
        throw "error creating a new message"
    }
}

export async function getAllUsers(userId) {

    try {
        let result = await prisma.user.findMany(
            {
                where: {
                    id: { not: userId }
                }
            }
        )
        return result

    } catch (error) {
        throw 'error getting All users'
    }



}

export async function updateChatLastMessage(chatId, lastMessage) {

    try {
        const result = await prisma.chat.update({
            where: { id: chatId },
            data: {
                lastMessageId: lastMessage.id
            },
            select: {
                users: {
                    select: userProfileSelect
                },
                lastMessage: { include: { sender: { select: userProfileSelect } } },
                name: true,
                id: true,
            }
        })
        return result

    } catch (error) {
        console.log(error);

        throw 'error updating chat lastMessage'
    }



}



async function fn() {

    try {
        await prisma.request.delete({
            where: {
                id: "139794ed-6ccb-4e3c-ba9c-26ba68aff7d5"
            }
        })

    } catch (error) {
        console.log(error);

    }


}
/*fn()*/
