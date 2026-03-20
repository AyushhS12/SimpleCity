
interface Id {
    $oid: string
}

export interface Player {
    _id: Id,
    name: string,
    username: string,
    email: string,
    password: string,
}

export interface PlayerDetails {
    id: string,
}