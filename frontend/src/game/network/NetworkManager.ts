import { extractPlayerJoinedFromBuffer, extractPlayerMoveFromBuffer, extractSnapshotFromDataview } from "../../utils/utils"
export enum PacketType {
    Snapshot,
    PlayerJoined,
    PlayerLeft,
    PlayerMoved,
    Ping,
    Pong
}
export enum Direction {
    Up,
    Down,
    Left,
    Right,
}


export default class NetworkManager extends Phaser.Events.EventEmitter {
    socket: WebSocket
    id!: bigint
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
                    this.emit("snapshot", snapshot)
                    break
                }
                case PacketType.PlayerMoved: {
                    const move = extractPlayerMoveFromBuffer(view.buffer)
                    this.emit("move", move)
                    break
                }
                case PacketType.PlayerJoined: {
                    const event = extractPlayerJoinedFromBuffer(view.buffer)
                    this.emit("joined", event)
                    break
                }
                case PacketType.PlayerLeft: {
                    const player = view.getBigInt64(1, true);
                    console.log("Player with id " + player + " left")
                    this.emit("left", player)
                    break
                }
                case PacketType.Ping: {
                    const bytes = new DataView(new ArrayBuffer(9))
                    bytes.setUint8(0,PacketType.Pong)
                    bytes.setBigInt64(1, this.id,true)
                    this.socket.send(bytes.buffer);
                    console.log(new Uint8Array(bytes.buffer))
                }
            }
        }
        this.socket.onclose = (e) => {
            console.log(e)
        }
    }

    sendMove(direction: Direction, x: number, y: number) {
        const buffer = new ArrayBuffer(18)
        const view = new DataView(buffer)

        view.setUint8(0, PacketType.PlayerMoved)
        view.setUint8(1, direction)

        // write i64 to player id
        view.setBigInt64(2, this.id, true)

        view.setFloat32(10, x, true)
        view.setFloat32(14, y, true)

        this.socket.send(buffer)
    }
}