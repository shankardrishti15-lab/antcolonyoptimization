import { motion } from "framer-motion";

interface AntProps {
  id: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  isMoving: boolean;
}

const Ant = ({ x, y, startX, startY, isMoving }: AntProps) => {
  return (
    <motion.div
      className="ant-agent"
      initial={{ 
        left: startX, 
        top: startY,
        opacity: 0,
        scale: 0.5
      }}
      animate={{ 
        left: isMoving ? x : startX, 
        top: isMoving ? y : startY,
        opacity: 1,
        scale: 1
      }}
      transition={{ 
        left: { duration: 1.2, ease: "easeInOut" },
        top: { duration: 1.2, ease: "easeInOut" },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }}
    >
      <span className="text-lg animate-ant-walk">🐜</span>
    </motion.div>
  );
};

export default Ant;
