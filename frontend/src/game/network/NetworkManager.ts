
export const PacketType = {
    Snapshot: 0,
    PlayerJoined: 1,
    PlayerLeft: 2,
    PlayerMoved: 3
} as const

export default class NetworkManager {
    socket: WebSocket
    constructor(url: string) {
        this.socket = new WebSocket(url)
        this.socket.onmessage = (e) => {
            const view = new DataView(e.data as ArrayBuffer);
            const packetType = view.getUint8(0)
            switch (packetType) {
                case PacketType.Snapshot: {
                    // this.players = extractSnapshotFromDataview( e.data).players;
                    // console.log(this.players)s
                    break
                }
                case PacketType.PlayerJoined: {
                    break
                }
                case PacketType.PlayerLeft: {
                    break
                }
                case PacketType.PlayerMoved: {
                    break
                }
            }
            // const position: Position = { x: view.getFloat32(0, true), y: view.getFloat32(4, true) };
            // console.log(position);
        }
        this.socket.onclose = (e) => {
            console.log(e)
        }
    }
}