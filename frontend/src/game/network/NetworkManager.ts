import { extractPlayerMoveFromBuffer, extractSnapshotFromDataview } from "../../utils/extract"
export enum PacketType {
    Snapshot,
    PlayerJoined,
    PlayerLeft,
    PlayerMoved,
}


export default class NetworkManager extends Phaser.Events.EventEmitter {
    socket: WebSocket
    id!: Uint8Array
    constructor(url: string) {
        super()
        this.socket = new WebSocket(url)
        this.socket.binaryType = "arraybuffer"
        this.socket.onmessage = (e) => {
            console.log(e.data)
            const view = new DataView(e.data);
            const packetType = view.getUint8(0)
            switch (packetType) {
                case PacketType.Snapshot: {
                    const snapshot = extractSnapshotFromDataview(view.buffer)
                    this.id = snapshot.current_player
                    this.emit("snapshot", snapshot)
                    break
                }
                case PacketType.PlayerMoved: {
                    const move = extractPlayerMoveFromBuffer(view.buffer)
                    this.emit("move", move)
                    break
                }
                case PacketType.PlayerJoined: {
                    break
                }
                case PacketType.PlayerLeft: {
                    break
                }
            }
        }
        this.socket.onclose = (e) => {
            console.log(e)
        }
    }

    sendMove(x: number, y: number) {
        const buffer = new ArrayBuffer(21)
        const view = new DataView(buffer)

        view.setUint8(0, PacketType.PlayerMoved)

        for (let i = 0; i < 12; i++) {
            const byte = this.id[i];
            view.setUint8(1 + i, byte)
        }

        view.setFloat32(13, x, true)
        view.setFloat32(17, y, true)

        this.socket.send(buffer)
    }
    // send(type: PacketType,data: unknown){
    //     const buffer = new ArrayBuffer()
    //     const view = new DataView(buffer)
    //     view.setUint8(0, type)
    //     this.socket.send(buffer)
    // }
}