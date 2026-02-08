import { FileText, Shield, ShieldAlert } from "lucide-react";

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
      icon: <Shield className="w-4 h-4 text-muted-foreground" />,
      label: "Pending",
      labelClass: "text-muted-foreground",
    },
    safe: {
      className: "file-card file-card-safe",
      icon: <Shield className="w-4 h-4 text-success" />,
      label: "Safe",
      labelClass: "text-success font-semibold",
    },
    infected: {
      className: "file-card file-card-infected animate-pulse-soft",
      icon: <ShieldAlert className="w-4 h-4 text-destructive" />,
      label: "Infected",
      labelClass: "text-destructive font-semibold",
    },
  };

  const config = statusConfig[status];

  return (
    <div id={id} className={config.className}>
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
    </div>
  );
};

export default FileCard;
