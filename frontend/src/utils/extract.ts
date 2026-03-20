import { stringify } from "uuid"

export const PlayerSize = 12

// # Snapshot extraction logic
export type Snapshot = {
    room_id: string,
    players: string[]
}


export type MoveEvent = {
    player: Uint8Array,
    x: number,
    y: number
}

export const extractSnapshotFromDataview = (buffer: ArrayBuffer): Snapshot => {
    const bytes = new Uint8Array(buffer)
    const room_id = new Uint8Array(bytes.slice(1, 17));
    const room = stringify(room_id)
    const players = [];
    // const decoder = new TextDecoder("utf-8")
    const count = bytes[17];
    let offset = 18;
    for (let i = 0; i < count; i++) {
        const id = bytes.subarray(offset, offset + PlayerSize);

        const hex = [...id]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        players.push(hex);


        offset += PlayerSize;
    }
    return { room_id: room, players }
}

export const extractPlayerMoveFromBuffer = (buffer: ArrayBuffer): MoveEvent => {
    const bytes = new Uint8Array(buffer)
    const id = bytes.subarray(1, 13)
    const [x, y] = [bytes[13], bytes[14]]
    return {
        player: id,
        x, 
        y
    }
}