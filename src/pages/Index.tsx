import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, RotateCcw, Sparkles, Shield, Zap } from "lucide-react";
import FileCard, { FileStatus } from "@/components/FileCard";
import Ant from "@/components/Ant";
import DetectionAlert from "@/components/DetectionAlert";
import Legend from "@/components/Legend";
import FloatingShapes from "@/components/decorative/FloatingShapes";
import AnimatedAntIcon from "@/components/decorative/AnimatedAntIcon";

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

  const startScan = useCallback(() => {
    if (files.length === 0 || isScanning) return;

    setIsScanning(true);
    setScanComplete(false);
    setDetectionAlert(null);
    setAnts([]);

    const scannedFiles = files.map((file) => ({
      ...file,
      status: (Math.random() > 0.5 ? "infected" : "safe") as FileStatus,
    }));

    setTimeout(() => {
      setFiles(scannedFiles);
      const infectedFiles = scannedFiles.filter((f) => f.status === "infected");

      if (infectedFiles.length > 0) {
        const containerRect = antContainerRef.current?.getBoundingClientRect();
        const startX = containerRect ? containerRect.width / 2 : 200;
        const startY = 50;

        const newAnts: AntAgent[] = infectedFiles.flatMap((file, fileIndex) => {
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

  const resetSimulation = () => {
    setFiles([]);
    setAnts([]);
    setIsScanning(false);
    setScanComplete(false);
    setDetectionAlert(null);
    
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingShapes />
      
      {/* Header Section */}
      <header className="py-16 sm:py-24 relative">
        <div className="section-container">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <AnimatedAntIcon className="w-16 h-16" />
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
              <Shield className="w-12 h-12 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl font-bold heading-gradient mb-6 tracking-tight">
              Ant Colony Optimization
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              An interactive simulation of antivirus optimization 
              <span className="text-foreground font-medium"> inspired by nature</span>
            </p>

            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="section-badge">
                <Sparkles className="w-4 h-4" />
                Bio-Inspired Computing
              </span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <main className="section-container pb-16 space-y-8">
        {/* Explanation Section */}
        <motion.section 
          className="card-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 shrink-0">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                How Does It Work?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                Ant Colony Optimization is inspired by how ants find food. When ants discover a food source, 
                they leave pheromone trails that attract other ants. Similarly, antivirus software uses this 
                idea to <span className="text-foreground font-medium">focus more scanning resources on suspicious files</span>, 
                detecting viruses faster and more efficiently instead of scanning everything equally.
              </p>
            </div>
          </div>
        </motion.section>

        {/* File Upload Section */}
        <motion.section 
          className="card-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Scan Simulation
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <label className="btn-primary cursor-pointer group">
              <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              Upload Files
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
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Play className="w-5 h-5" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </button>
            
            <button onClick={resetSimulation} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Scan Statistics */}
          <AnimatePresence>
            {scanComplete && files.length > 0 && (
              <motion.div 
                className="grid grid-cols-3 gap-4 mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="stat-card">
                  <p className="text-3xl font-bold text-foreground">{files.length}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Total Files</p>
                </div>
                <div className="stat-card border-2 border-success/20">
                  <p className="text-3xl font-bold text-success">{safeCount}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Safe</p>
                </div>
                <div className="stat-card border-2 border-destructive/20">
                  <p className="text-3xl font-bold text-destructive">{infectedCount}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Infected</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ant Visualization Container */}
          <div
            ref={antContainerRef}
            className={`scan-zone min-h-[220px] ${isScanning ? "scan-zone-active" : ""}`}
          >
            {/* Ants */}
            {ants.map((ant) => (
              <Ant key={ant.id} {...ant} />
            ))}

            {/* File Grid */}
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-14 h-14 mb-4 opacity-40" />
                </motion.div>
                <p className="text-lg font-medium">Upload files to begin</p>
                <p className="text-sm mt-1 opacity-70">Drop your files here or click upload</p>
              </div>
            ) : (
              <motion.div
                ref={fileGridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FileCard
                      id={file.id}
                      fileName={file.name}
                      status={file.status}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Legend Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Legend />
        </motion.div>

        {/* Conclusion Section */}
        <motion.section 
          className="card-glass relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-success/10 to-transparent rounded-full blur-2xl" />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
              Key Takeaway
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              This simulation demonstrates how Ant Colony Optimization improves antivirus efficiency 
              by prioritizing high-risk files. Just like ants concentrate on the best food sources, 
              the scanning agents focus their resources on infected files, making virus detection 
              <span className="text-foreground font-medium"> faster and more effective</span>. 
              This bio-inspired approach represents the intersection of biology and computer science.
            </p>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 mt-10 bg-muted/30">
        <div className="section-container text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Educational Demonstration of Ant Colony Optimization
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <span>🐜</span>
            <span>Inspired by nature, applied to cybersecurity</span>
          </p>
        </div>
      </footer>

      {/* Detection Alert */}
      <AnimatePresence>
        {detectionAlert && (
          <DetectionAlert
            fileName={detectionAlert}
            onClose={() => setDetectionAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
