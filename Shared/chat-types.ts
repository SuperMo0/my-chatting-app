
export type User = {
    id: string,
    name: string,
}

export type Chat = {
    id: string,
    users: User[]
}