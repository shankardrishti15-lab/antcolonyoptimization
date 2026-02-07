import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Play, RotateCcw, Bug, Shield } from "lucide-react";
import FileCard, { FileStatus } from "@/components/FileCard";
import Ant from "@/components/Ant";
import DetectionAlert from "@/components/DetectionAlert";
import Legend from "@/components/Legend";

interface UploadedFile {
  id: string;
  name: string;
  status: FileStatus;
}

interface AntAgent {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetFileId: string;
  isMoving: boolean;
}

const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [ants, setAnts] = useState<AntAgent[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectionAlert, setDetectionAlert] = useState<string | null>(null);
  const fileGridRef = useRef<HTMLDivElement>(null);
  const antContainerRef = useRef<HTMLDivElement>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: UploadedFile[] = Array.from(uploadedFiles).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      status: "pending" as FileStatus,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setScanComplete(false);
  };

  // Get file card position
  const getFilePosition = useCallback((fileId: string) => {
    const fileElement = document.getElementById(fileId);
    const container = antContainerRef.current;
    
    if (!fileElement || !container) return { x: 0, y: 0 };
    
    const fileRect = fileElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    return {
      x: fileRect.left - containerRect.left + fileRect.width / 2,
      y: fileRect.top - containerRect.top + fileRect.height / 2,
    };
  }, []);

  // Start scan simulation
  const startScan = useCallback(() => {
    if (files.length === 0 || isScanning) return;

    setIsScanning(true);
    setScanComplete(false);
    setDetectionAlert(null);
    setAnts([]);

    // Randomly mark some files as infected (30-50% chance)
    const scannedFiles = files.map((file) => ({
      ...file,
      status: (Math.random() > 0.5 ? "infected" : "safe") as FileStatus,
    }));

    // Update file statuses with a delay for effect
    setTimeout(() => {
      setFiles(scannedFiles);

      // Get infected files
      const infectedFiles = scannedFiles.filter((f) => f.status === "infected");

      // Create ants that target infected files
      if (infectedFiles.length > 0) {
        const containerRect = antContainerRef.current?.getBoundingClientRect();
        const startX = containerRect ? containerRect.width / 2 : 200;
        const startY = 50;

        const newAnts: AntAgent[] = infectedFiles.flatMap((file, fileIndex) => {
          // Create 2-3 ants per infected file
          const antCount = Math.floor(Math.random() * 2) + 2;
          return Array.from({ length: antCount }, (_, antIndex) => ({
            id: `ant-${file.id}-${antIndex}`,
            x: startX + (Math.random() - 0.5) * 100,
            y: startY + Math.random() * 30,
            targetX: 0,
            targetY: 0,
            targetFileId: file.id,
            isMoving: false,
          }));
        });

        setAnts(newAnts);

        // Start ant movement after a short delay
        setTimeout(() => {
          setAnts((prevAnts) =>
            prevAnts.map((ant) => {
              const pos = getFilePosition(ant.targetFileId);
              return {
                ...ant,
                x: pos.x + (Math.random() - 0.5) * 40,
                y: pos.y + (Math.random() - 0.5) * 40,
                targetX: pos.x,
                targetY: pos.y,
                isMoving: true,
              };
            })
          );

          // Show detection alert after ants reach target
          setTimeout(() => {
            if (infectedFiles.length > 0) {
              setDetectionAlert(infectedFiles[0].name);
            }
            setIsScanning(false);
            setScanComplete(true);
          }, 1200);
        }, 300);
      } else {
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 500);
  }, [files, isScanning, getFilePosition]);

  // Reset simulation
  const resetSimulation = () => {
    setFiles([]);
    setAnts([]);
    setIsScanning(false);
    setScanComplete(false);
    setDetectionAlert(null);
    
    // Reset file input
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Update ant positions when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (ants.length > 0 && !isScanning) {
        setAnts((prevAnts) =>
          prevAnts.map((ant) => {
            const pos = getFilePosition(ant.targetFileId);
            return {
              ...ant,
              x: pos.x + (Math.random() - 0.5) * 40,
              y: pos.y + (Math.random() - 0.5) * 40,
              targetX: pos.x,
              targetY: pos.y,
            };
          })
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ants.length, isScanning, getFilePosition]);

  const infectedCount = files.filter((f) => f.status === "infected").length;
  const safeCount = files.filter((f) => f.status === "safe").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="py-12 sm:py-16 border-b border-border">
        <div className="section-container text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">🐜</span>
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold heading-gradient mb-4">
            Ant Colony Optimization
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An interactive simulation of antivirus optimization inspired by ant behavior
          </p>
        </div>
      </header>

      <main className="section-container py-10 space-y-10">
        {/* Explanation Section */}
        <section className="card-elevated">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Bug className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                How Does It Work?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ant Colony Optimization is inspired by how ants find food. When ants discover a food source, 
                they leave pheromone trails that attract other ants. Similarly, antivirus software uses this 
                idea to focus more scanning resources on suspicious files, detecting viruses faster and more 
                efficiently instead of scanning everything equally.
              </p>
            </div>
          </div>
        </section>

        {/* File Upload Section */}
        <section className="card-elevated">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            File Upload & Scan
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="btn-primary cursor-pointer">
              <Upload className="w-5 h-5" />
              Upload Files for Scan
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={startScan}
              disabled={files.length === 0 || isScanning}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </button>
            
            <button onClick={resetSimulation} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Reset Simulation
            </button>
          </div>

          {/* Scan Statistics */}
          {scanComplete && files.length > 0 && (
            <div className="flex gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div className="text-center px-4">
                <p className="text-2xl font-bold text-foreground">{files.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
              <div className="text-center px-4 border-l border-border">
                <p className="text-2xl font-bold text-success">{safeCount}</p>
                <p className="text-sm text-muted-foreground">Safe</p>
              </div>
              <div className="text-center px-4 border-l border-border">
                <p className="text-2xl font-bold text-destructive">{infectedCount}</p>
                <p className="text-sm text-muted-foreground">Infected</p>
              </div>
            </div>
          )}

          {/* Ant Visualization Container */}
          <div
            ref={antContainerRef}
            className="relative min-h-[200px] border-2 border-dashed border-border rounded-xl p-6 bg-muted/30"
          >
            {/* Ants */}
            {ants.map((ant) => (
              <Ant key={ant.id} {...ant} />
            ))}

            {/* File Grid */}
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Upload className="w-12 h-12 mb-3 opacity-50" />
                <p>Upload files to begin the simulation</p>
              </div>
            ) : (
              <div
                ref={fileGridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    id={file.id}
                    fileName={file.name}
                    status={file.status}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Legend Section */}
        <Legend />

        {/* Conclusion Section */}
        <section className="card-elevated bg-gradient-to-br from-primary/5 to-success/5">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Conclusion
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            This simulation demonstrates how Ant Colony Optimization improves antivirus efficiency 
            by prioritizing high-risk files. Just like ants concentrate on the best food sources, 
            the scanning agents (ants) focus their resources on infected files, making virus detection 
            faster and more effective. This bio-inspired approach represents the intersection of 
            biology and computer science in solving real-world security problems.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-10">
        <div className="section-container text-center">
          <p className="text-sm text-muted-foreground">
            Educational demonstration of Ant Colony Optimization in Antivirus Systems
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            🐜 Inspired by nature, applied to cybersecurity
          </p>
        </div>
      </footer>

      {/* Detection Alert */}
      {detectionAlert && (
        <DetectionAlert
          fileName={detectionAlert}
          onClose={() => setDetectionAlert(null)}
        />
      )}
    </div>
  );
};

export default Index;
