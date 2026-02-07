import { FileText, Shield, ShieldAlert, Clock } from "lucide-react";

export type FileStatus = "pending" | "safe" | "infected";

interface FileCardProps {
  fileName: string;
  status: FileStatus;
  id: string;
}

const FileCard = ({ fileName, status, id }: FileCardProps) => {
  const statusConfig = {
    pending: {
      className: "file-card file-card-pending",
      icon: <Clock className="w-5 h-5 text-muted-foreground" />,
      label: "Pending",
      labelClass: "text-muted-foreground",
    },
    safe: {
      className: "file-card file-card-safe",
      icon: <Shield className="w-5 h-5 text-success" />,
      label: "Safe",
      labelClass: "text-success",
    },
    infected: {
      className: "file-card file-card-infected animate-pulse-glow",
      icon: <ShieldAlert className="w-5 h-5 text-destructive" />,
      label: "Infected",
      labelClass: "text-destructive",
    },
  };

  const config = statusConfig[status];

  return (
    <div id={id} className={config.className}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{fileName}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {config.icon}
            <span className={`text-sm font-medium ${config.labelClass}`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
