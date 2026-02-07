import { ShieldAlert, X } from "lucide-react";

interface DetectionAlertProps {
  fileName: string;
  onClose: () => void;
}

const DetectionAlert = ({ fileName, onClose }: DetectionAlertProps) => {
  return (
    <div className="detection-alert">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="p-3 bg-destructive/10 rounded-full">
          <ShieldAlert className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Virus Detected!</h4>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-destructive">{fileName}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Ant Colony Optimization focuses scanning resources here for faster detection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetectionAlert;
