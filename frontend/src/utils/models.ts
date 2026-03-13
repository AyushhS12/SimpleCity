
interface Id {
    $oid: string
}

export interface Player {
    id: Id,
    name: string,
    username: string,
    email: string,
    password: string,
}