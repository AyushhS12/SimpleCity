import GameCanvas from "../components/GameCanvas";

const World = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <GameCanvas />
    </div>
  );
}

export default World