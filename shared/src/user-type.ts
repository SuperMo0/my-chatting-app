export type User = {
    id: string,
    name: string,
    avatar: string
}

export type InUser = User & {
    email: string,
    password: string
}
