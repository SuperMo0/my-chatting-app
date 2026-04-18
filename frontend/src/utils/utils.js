import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";


export function cn(...inputs) {
    return twMerge(clsx(inputs));
}


export function getFriend(userId, chat) {
    if (chat == null) return null;

    return chat.users[0].id != userId ? chat.users[0] : chat.users[1];
}

export function fixDate(timestamp) {

    try {
        let date = new Date(timestamp);

        return format(date, 'd MMM, hh:mm a');

    } catch (error) {
        console.log(timestamp);
    }

}