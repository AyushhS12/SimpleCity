import { useContext } from "react";
import { PlayerContext } from "./PlayerContext";
import { useNavigate } from "react-router-dom";

export const usePlayerContext = ()=>{
    const context =  useContext(PlayerContext)
    const navigate = useNavigate()
    if(!context){
        navigate("/auth")
        throw new Error("Login Please")
    }
    return context
}