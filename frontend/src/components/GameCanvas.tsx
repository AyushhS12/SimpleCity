import { useCallback,/* useContext ,*/ useEffect, useRef } from "react";
import Phaser from "phaser";
import { config } from "../game/Game";
// import { PlayerContext } from "../context/PlayerContext";
import axios from "axios";
import toast, { ErrorIcon } from "react-hot-toast";
import { CheckCircle2, Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { usePlayerContext } from "../context/usePlayerContext";

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  // const { setPlayer } = usePlayerContext()
  const navigate = useNavigate()
  // const { player, setPlayer } = useContext(PlayerContext)!;
  const fetchUserDetials = useCallback(async (game: Phaser.Game) => {
    const toastId = toast.loading("Fetching Player Details", {
      icon: <Loader2Icon />
    })
    try {
      // if (!setPlayer) {
      //   return
      // }
      const res = await axios.get("http://localhost:7878/player/stats", { withCredentials: true })
      game.registry.set("player",res.data)
      // setPlayer(res.data)
      toast.success("Player Entered Successfully", {
        id: toastId,
        duration: 1800,
        icon: <CheckCircle2 color="green" />
      })
    } catch (e) {
      toast.error("Error Fetching Details", {
        id: toastId,
        duration: 1800,
        icon: <ErrorIcon color="red" />
      })
      console.log(e)
      navigate("/auth")
      return
    }

  }, [navigate])

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        ...config,
        parent: "phaser-container",
      });
    }
    fetchUserDetials(gameRef.current)
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [fetchUserDetials]);

  return <div id="phaser-container" />;
}
