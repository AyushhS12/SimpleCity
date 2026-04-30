
export type PlayerId = bigint

export type Players = {
    id:bigint,
    username:string
}[]

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
    id: bigint,
    username:string
}