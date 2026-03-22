import type { PlayerSprite } from "../game/Entities/Player"
import type { Direction } from "../game/network/NetworkManager"

export const PlayerSize = 12

// # Snapshot extraction logic
export type Snapshot = {
    room_id: Uint8Array,
    current_player: Uint8Array
    players: string[]
}

export type MoveEvent = {
    player: string,
    direction:Direction,
    x: number,
    y: number
}

export const extractPlayerJoinedFromBuffer = (buffer: ArrayBuffer)=>{
    const bytes = new Uint8Array(buffer)

    const id = bytes.slice(1,13)
    return convertUint8IntoHex(id)
}

export const extractSnapshotFromDataview = (buffer: ArrayBuffer): Snapshot => {
    const bytes = new Uint8Array(buffer)
    const room_id = new Uint8Array(bytes.slice(1, 17))
    const current = bytes.slice(17, 29)
    const players = [];
    const count = bytes[29];
    let offset = 30;
    for (let i = 0; i < count; i++) {
        const id = bytes.subarray(offset, offset + PlayerSize);
        const hex = convertUint8IntoHex(id)
        console.log(hex)
        players.push(hex);


        offset += PlayerSize;
    }
    return { room_id, current_player: current, players }
}

export const extractPlayerMoveFromBuffer = (buffer: ArrayBuffer): MoveEvent => {
    const bytes = new Uint8Array(buffer)
    const view = new DataView(buffer)
    const direction = view.getUint8(1);
    const id = bytes.subarray(2, 14)
    const [x, y] = [view.getFloat32(14, true), view.getFloat32(18, true)]
    return {
        player: convertUint8IntoHex(id),
        direction,
        x,
        y
    }
}


// export const extractLeaveEventFromBuffer = (buffer: ArrayBuffer) => {
//     const bytes = new Uint8Array(buffer)

// }


export const convertUint8IntoHex = (id: Uint8Array) => {
    if (id.length !== 12) {
        throw new Error("Inavlid id bytes")
    }
    return Array.from(id)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

export const convertHexIntoUint8 = (id: string) => {
    if (id.length !== 24) {
        throw new Error("Inavlid id")
    }
    const bytes = new Uint8Array(12)
    for (let i = 0; i < 12; i++) {
        const byte = parseInt(id.slice(i * 2, i * 2 + 2), 16);

        if (Number.isNaN(byte)) {
            throw new Error("Invalid hex string");
        }
        bytes[i] = byte
    }
    return bytes
}


export const getDistance = (player: PlayerSprite, x: number, y: number) => {
    const X = (player.x - x)
    const Y = (player.y - y)

    return Math.sqrt((X*X) + (Y*Y))
}