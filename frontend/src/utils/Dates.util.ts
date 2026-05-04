import { format } from "date-fns";

export function fixDate(timestamp: string | Date) {
    let date = new Date(timestamp);
    return format(date, 'd MMM, hh:mm a');
}