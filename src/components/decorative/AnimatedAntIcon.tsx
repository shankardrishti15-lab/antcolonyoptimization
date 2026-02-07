import { motion } from "framer-motion";

interface AnimatedAntIconProps {
  className?: string;
}

const AnimatedAntIcon = ({ className = "" }: AnimatedAntIconProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        fill="none"
      >
        {/* Ant body */}
        <motion.ellipse
          cx="32"
          cy="40"
          rx="8"
          ry="10"
          className="fill-foreground"
        />
        <motion.ellipse
          cx="32"
          cy="26"
          rx="6"
          ry="7"
          className="fill-foreground"
        />
        <motion.circle
          cx="32"
          cy="14"
          r="6"
          className="fill-foreground"
        />
        
        {/* Antennae */}
        <motion.path
          d="M28 10 Q 24 4, 20 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground"
          animate={{ d: ["M28 10 Q 24 4, 20 2", "M28 10 Q 22 5, 18 4", "M28 10 Q 24 4, 20 2"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M36 10 Q 40 4, 44 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground"
          animate={{ d: ["M36 10 Q 40 4, 44 2", "M36 10 Q 42 5, 46 4", "M36 10 Q 40 4, 44 2"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Legs */}
        <motion.g className="text-foreground" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <motion.path 
            d="M24 28 L 14 24" 
            animate={{ d: ["M24 28 L 14 24", "M24 28 L 12 26", "M24 28 L 14 24"] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.path 
            d="M40 28 L 50 24" 
            animate={{ d: ["M40 28 L 50 24", "M40 28 L 52 26", "M40 28 L 50 24"] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
          />
          <motion.path 
            d="M24 36 L 12 38" 
            animate={{ d: ["M24 36 L 12 38", "M24 36 L 10 36", "M24 36 L 12 38"] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          />
          <motion.path 
            d="M40 36 L 52 38" 
            animate={{ d: ["M40 36 L 52 38", "M40 36 L 54 36", "M40 36 L 52 38"] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
          />
          <motion.path 
            d="M26 46 L 18 54" 
            animate={{ d: ["M26 46 L 18 54", "M26 46 L 16 52", "M26 46 L 18 54"] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
          <motion.path 
            d="M38 46 L 46 54" 
            animate={{ d: ["M38 46 L 46 54", "M38 46 L 48 52", "M38 46 L 46 54"] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.5 }}
          />
        </motion.g>
        
        {/* Eyes */}
        <circle cx="29" cy="12" r="1.5" className="fill-background" />
        <circle cx="35" cy="12" r="1.5" className="fill-background" />
      </motion.svg>
    </motion.div>
  );
};

export default AnimatedAntIcon;
