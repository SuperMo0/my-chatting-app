import bcrypt from 'bcrypt'


export async function hash(password: string) {
    let result = await bcrypt.hash(password, 12);
    return result
}

export async function compare(current: string, original: string) {

    let result = await bcrypt.compare(current, original);
    return result;
}