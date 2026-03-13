import { createContext } from "react";
import type { Player } from "../utils/models";

interface PlayerContextType {
    player: Player | undefined,
    setPlayer?: React.Dispatch<React.SetStateAction<Player | undefined>>
}

export const PlayerContext = createContext<PlayerContextType | null>({
    player: undefined,
})

