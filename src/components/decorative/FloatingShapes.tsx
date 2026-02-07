import { motion } from "framer-motion";

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top-left blob */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Top-right organic shape */}
      <motion.svg
        className="absolute top-10 right-10 w-32 h-32 text-primary/10"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <path
          fill="currentColor"
          d="M50 0C60 20 80 20 100 50C80 60 80 80 50 100C40 80 20 80 0 50C20 40 20 20 50 0Z"
        />
      </motion.svg>

      {/* Center-left diamond */}
      <motion.div
        className="absolute top-1/3 -left-6 w-12 h-12 rotate-45 bg-gradient-to-br from-success/20 to-success/5"
        animate={{
          y: [0, 20, 0],
          rotate: [45, 55, 45],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom-right blob */}
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-success/8 to-primary/5 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating dots pattern */}
      <div className="absolute top-1/4 right-1/4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${i * 15}px`,
              top: `${(i % 2) * 20}px`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Small accent crosses */}
      <motion.svg
        className="absolute bottom-1/4 left-1/4 w-6 h-6 text-primary/30"
        viewBox="0 0 24 24"
        animate={{ rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path stroke="currentColor" strokeWidth="2" d="M12 2v20M2 12h20" />
      </motion.svg>

      {/* Curved line decoration */}
      <svg className="absolute top-1/2 right-0 w-40 h-40 text-success/10" viewBox="0 0 100 100">
        <motion.path
          d="M10 50 Q 50 10, 90 50 T 170 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="200"
          animate={{ strokeDashoffset: [200, 0, 200] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default FloatingShapes;
