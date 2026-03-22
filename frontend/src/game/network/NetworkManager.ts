import { convertUint8IntoHex, extractPlayerJoinedFromBuffer, extractPlayerMoveFromBuffer, extractSnapshotFromDataview } from "../../utils/extract"
export enum PacketType {
    Snapshot,
    PlayerJoined,
    PlayerLeft,
    PlayerMoved,
}
export enum Direction {
    Up,
    Down,
    Left,
    Right,
}


export default class NetworkManager extends Phaser.Events.EventEmitter {
    socket: WebSocket
    id!: Uint8Array
    constructor(url: string) {
        super()
        this.socket = new WebSocket(url)
        this.socket.binaryType = "arraybuffer"
        this.socket.onmessage = (e) => {
            // console.log(new Uint8Array(e.data))
            const view = new DataView(e.data);
            const packetType = view.getUint8(0)
            switch (packetType) {
                case PacketType.Snapshot: {
                    const snapshot = extractSnapshotFromDataview(view.buffer)
                    this.id = snapshot.current_player
                    console.log(convertUint8IntoHex(this.id))
                    this.emit("snapshot", snapshot)
                    console.log(snapshot)
                    break
                }
                case PacketType.PlayerMoved: {
                    const move = extractPlayerMoveFromBuffer(view.buffer)
                    this.emit("move", move)
                    // console.log(move)
                    break
                }
                case PacketType.PlayerJoined: {
                    const event = extractPlayerJoinedFromBuffer(view.buffer)
                    // console.log(event)
                    this.emit("joined", event)
                    break
                }
                case PacketType.PlayerLeft: {
                    // const player = extractLeaveEventFromBuffer(view.buffer)
                    console.log(packetType)
                    console.log("PLayer left")
                    this.emit("left", )
                    break
                }
            }
        }
        this.socket.onclose = (e) => {
            console.log(e)
        }
    }

    sendMove(direction: Direction, x: number, y: number) {
        const buffer = new ArrayBuffer(22)
        const view = new DataView(buffer)

        view.setUint8(0, PacketType.PlayerMoved)
        view.setUint8(1, direction)
        for (let i = 0; i < 12; i++) {
            const byte = this.id[i];
            view.setUint8(2 + i, byte)
        }

        view.setFloat32(14, x, true)
        view.setFloat32(18, y, true)

        this.socket.send(buffer)
    }
    // send(type: PacketType,data: unknown){
    //     const buffer = new ArrayBuffer()
    //     const view = new DataView(buffer)
    //     view.setUint8(0, type)
    //     this.socket.send(buffer)
    // }
}