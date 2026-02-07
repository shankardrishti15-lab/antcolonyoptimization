interface AntProps {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isMoving: boolean;
}

const Ant = ({ x, y, targetX, targetY, isMoving }: AntProps) => {
  const angle = Math.atan2(targetY - y, targetX - x) * (180 / Math.PI);
  
  return (
    <div
      className={`ant-agent ${isMoving ? "animate-ant-walk" : ""}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `rotate(${angle + 90}deg)`,
      }}
    >
      🐜
    </div>
  );
};

export default Ant;
