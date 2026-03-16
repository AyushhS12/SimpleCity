export const PlayerSize = 12

// # Snapshot extraction logic
export type Snapshot = {
    players: string[]
}


export const extractSnapshotFromDataview = (player_id: string,buffer: ArrayBuffer): Snapshot => {
    const players = [];
    // const decoder = new TextDecoder("utf-8")
    for (let offset = 1; offset < buffer.byteLength; offset += PlayerSize) {
        const id = new Uint8Array(buffer.slice(offset, offset + PlayerSize))
        const hex = [...id]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("")
        if(player_id===hex) continue;
        players.push(hex) 
    }
    return { players }
}