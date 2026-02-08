import { motion } from "framer-motion";

const BiologyBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-secondary/5" />
      
      {/* Floating organic shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-success/8 blur-3xl"
        animate={{ 
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-40 h-40 rounded-full bg-secondary/8 blur-3xl"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div
        className="absolute bottom-40 left-1/4 w-36 h-36 rounded-full bg-primary/6 blur-3xl"
        animate={{ 
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Decorative leaf shapes */}
      <motion.svg
        className="absolute top-1/4 right-10 w-16 h-16 text-success/20"
        viewBox="0 0 100 100"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M50 10 C 20 30, 20 70, 50 90 C 80 70, 80 30, 50 10"
          fill="currentColor"
        />
      </motion.svg>

      <motion.svg
        className="absolute bottom-1/3 left-8 w-12 h-12 text-primary/15"
        viewBox="0 0 100 100"
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <path
          d="M50 10 C 20 30, 20 70, 50 90 C 80 70, 80 30, 50 10"
          fill="currentColor"
        />
      </motion.svg>
    </div>
  );
};

export default BiologyBackground;
