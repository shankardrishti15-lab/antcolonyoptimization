import { FileText, Shield, ShieldAlert, Clock } from "lucide-react";
import { motion } from "framer-motion";

export type FileStatus = "pending" | "safe" | "infected" | "scanning";

interface FileCardProps {
  fileName: string;
  status: FileStatus;
  id: string;
}

const FileCard = ({ fileName, status, id }: FileCardProps) => {
  const statusConfig = {
    pending: {
      className: "file-card file-card-pending",
      icon: <Clock className="w-4 h-4 text-muted-foreground" />,
      label: "Ready",
      labelClass: "text-muted-foreground",
    },
    scanning: {
      className: "file-card file-card-scanning",
      icon: <Shield className="w-4 h-4 text-primary animate-pulse" />,
      label: "Scanning...",
      labelClass: "text-primary font-medium",
    },
    safe: {
      className: "file-card file-card-safe",
      icon: <Shield className="w-4 h-4 text-success" />,
      label: "Safe",
      labelClass: "text-success font-semibold",
    },
    infected: {
      className: "file-card file-card-infected",
      icon: <ShieldAlert className="w-4 h-4 text-destructive" />,
      label: "Infected",
      labelClass: "text-destructive font-semibold",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div 
      id={id} 
      className={config.className}
      animate={status === "infected" ? { 
        boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 8px rgba(239, 68, 68, 0.2)", "0 0 0 0 rgba(239, 68, 68, 0)"]
      } : {}}
      transition={status === "infected" ? { 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      <div className="flex items-start gap-2">
        <div className="p-2 bg-muted/50 rounded-xl">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate text-sm">{fileName}</p>
          <div className="flex items-center gap-1 mt-1">
            {config.icon}
            <span className={`text-xs ${config.labelClass}`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;
