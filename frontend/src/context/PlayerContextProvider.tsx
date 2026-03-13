import { useContext, useState, type PropsWithChildren } from "react";
import { PlayerContext } from "./PlayerContext";
import type { Player } from "../utils/models";

export const PlayerContextProvider = (props: PropsWithChildren) => {
    const context = useContext(PlayerContext)
    const [player, setPlayer] = useState<Player | undefined>(context?.player)
    return <PlayerContext.Provider value={{player, setPlayer}}>{props.children}</PlayerContext.Provider>
}