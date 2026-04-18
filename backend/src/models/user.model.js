import prisma from './../lib/prisma.js'

export async function updateProfile(update) {

    try {
        const user = await prisma.user.update({
            data: {
                name: update.name,
                avatar: update.url,
            },
            where: {
                id: update.userId
            },
            select: {
                name: true,
                avatar: true,
                id: true,
            }
        })

    } catch (error) {
        throw "error updating user profile ";
    }



}