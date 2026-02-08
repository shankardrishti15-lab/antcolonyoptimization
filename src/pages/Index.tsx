import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, RotateCcw, Shield, Leaf } from "lucide-react";
import FileCard, { FileStatus } from "@/components/FileCard";
import Ant from "@/components/Ant";
import DetectionAlert from "@/components/DetectionAlert";
import Legend from "@/components/Legend";
import BiologyBackground from "@/components/decorative/BiologyBackground";

interface UploadedFile {
  id: string;
  name: string;
  status: FileStatus;
}

interface AntAgent {
  id: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetFileId: string;
  isMoving: boolean;
}

const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [ants, setAnts] = useState<AntAgent[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectionAlert, setDetectionAlert] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>("");
  const fileGridRef = useRef<HTMLDivElement>(null);
  const antContainerRef = useRef<HTMLDivElement>(null);

  // Handle file upload - all files start as PENDING (ready for scan)
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
    setScanStatus("Files uploaded. Click 'Start Scan' to begin.");
  };

  // Get file position for ant targeting
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
    setScanStatus("🔍 Scanning files...");

    // Set all files to "scanning" status first
    setFiles(prev => prev.map(file => ({ ...file, status: "scanning" as FileStatus })));

    // After a brief delay, determine which files are infected
    setTimeout(() => {
      // CRITICAL: Only 2-3 files become infected (random small subset)
      const numInfected = Math.min(Math.floor(Math.random() * 2) + 2, files.length); // 2-3 files
      const infectedIndices = new Set<number>();
      
      while (infectedIndices.size < numInfected && infectedIndices.size < files.length) {
        infectedIndices.add(Math.floor(Math.random() * files.length));
      }

      // Update file statuses: infected files = red, all others = green (safe)
      const scannedFiles = files.map((file, index) => ({
        ...file,
        status: (infectedIndices.has(index) ? "infected" : "safe") as FileStatus,
      }));

      setFiles(scannedFiles);
      
      const infectedFiles = scannedFiles.filter((f) => f.status === "infected");
      const safeFiles = scannedFiles.filter((f) => f.status === "safe");

      setScanStatus(`✅ Scan complete: ${safeFiles.length} safe, ${infectedFiles.length} infected`);

      // Create ants ONLY for infected files
      if (infectedFiles.length > 0) {
        const containerRect = antContainerRef.current?.getBoundingClientRect();
        const startX = containerRect ? containerRect.width / 2 : 200;
        const startY = 20;

        // Create ants that will move toward infected files only
        const newAnts: AntAgent[] = infectedFiles.flatMap((file) => {
          const antCount = Math.floor(Math.random() * 3) + 3; // 3-5 ants per infected file
          return Array.from({ length: antCount }, (_, antIndex) => {
            const pos = getFilePosition(file.id);
            return {
              id: `ant-${file.id}-${antIndex}`,
              startX: startX + (Math.random() - 0.5) * 100,
              startY: startY + Math.random() * 15,
              x: pos.x + (Math.random() - 0.5) * 30,
              y: pos.y + (Math.random() - 0.5) * 30,
              targetFileId: file.id,
              isMoving: false,
            };
          });
        });

        setAnts(newAnts);

        // Start ant movement after a short delay
        setTimeout(() => {
          setAnts((prevAnts) =>
            prevAnts.map((ant) => ({
              ...ant,
              isMoving: true,
            }))
          );

          // Show detection alert after ants reach infected files
          setTimeout(() => {
            if (infectedFiles.length > 0) {
              setDetectionAlert(infectedFiles[0].name);
            }
            setIsScanning(false);
            setScanComplete(true);
          }, 1400);
        }, 300);
      } else {
        setScanStatus("✅ All files are safe! No threats detected.");
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 1000);
  }, [files, isScanning, getFilePosition]);

  // Reset simulation completely
  const resetSimulation = () => {
    setFiles([]);
    setAnts([]);
    setIsScanning(false);
    setScanComplete(false);
    setDetectionAlert(null);
    setScanStatus("");
    
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Update ant positions on resize
  useEffect(() => {
    const handleResize = () => {
      if (ants.length > 0 && !isScanning) {
        setAnts((prevAnts) =>
          prevAnts.map((ant) => {
            const pos = getFilePosition(ant.targetFileId);
            return {
              ...ant,
              x: pos.x + (Math.random() - 0.5) * 30,
              y: pos.y + (Math.random() - 0.5) * 30,
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
    <div className="min-h-screen bg-background relative overflow-hidden leaf-pattern">
      <BiologyBackground />
      
      {/* Hero Section */}
      <header className="py-16 sm:py-20 relative">
        <div className="section-container">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-5xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🐜
              </motion.span>
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold heading-nature mb-4 tracking-tight">
              Ant Colony Optimization
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A biology-inspired simulation of antivirus optimization
            </p>

            <motion.div 
              className="mt-6 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="badge-nature">
                <Leaf className="w-4 h-4" />
                Nature + Technology
              </span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <main className="section-container pb-16 space-y-6">
        {/* How It Works Section */}
        <motion.section 
          className="card-leaf"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            How Does It Work?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ant Colony Optimization is inspired by how ants find food. When ants discover a food source, 
            they leave pheromone trails that attract other ants. Antivirus software uses this idea to 
            <span className="text-foreground font-semibold"> focus more scanning effort on suspicious files </span>
            instead of scanning everything equally.
          </p>
        </motion.section>

        {/* File Upload & Scan Section */}
        <motion.section 
          className="card-nature"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-2xl">📁</span>
            File Upload & Scan
          </h2>
          
          {/* Control Panel */}
          <div className="flex flex-wrap gap-3 mb-6">
            <label className="btn-nature cursor-pointer">
              <Upload className="w-5 h-5" />
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
              className="btn-scan disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </button>
            
            <button onClick={resetSimulation} className="btn-soft">
              <RotateCcw className="w-5 h-5" />
              Reset Simulation
            </button>
          </div>

          {/* Status Message */}
          {scanStatus && (
            <motion.div 
              className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm font-medium text-foreground">{scanStatus}</p>
            </motion.div>
          )}

          {/* Statistics */}
          <AnimatePresence>
            {scanComplete && files.length > 0 && (
              <motion.div 
                className="grid grid-cols-3 gap-3 mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="stat-nature">
                  <p className="text-2xl font-bold text-foreground">{files.length}</p>
                  <p className="text-xs text-muted-foreground font-medium">Total</p>
                </div>
                <div className="stat-nature border-2 border-success/30">
                  <p className="text-2xl font-bold text-success">{safeCount}</p>
                  <p className="text-xs text-muted-foreground font-medium">Safe</p>
                </div>
                <div className="stat-nature border-2 border-destructive/30">
                  <p className="text-2xl font-bold text-destructive">{infectedCount}</p>
                  <p className="text-xs text-muted-foreground font-medium">Infected</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend - Always Visible */}
          <div className="mb-6">
            <Legend />
          </div>

          {/* Simulation Zone */}
          <div
            ref={antContainerRef}
            className={`scan-zone min-h-[200px] ${isScanning ? "scan-zone-active" : ""}`}
          >
            {/* Ants - Only appear for infected files */}
            <AnimatePresence>
              {ants.map((ant) => (
                <Ant key={ant.id} {...ant} />
              ))}
            </AnimatePresence>

            {/* File Grid */}
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 text-muted-foreground">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Upload className="w-12 h-12 mb-3 opacity-40" />
                </motion.div>
                <p className="font-medium">Upload files to begin</p>
                <p className="text-sm mt-1 opacity-70">Files will be scanned for threats</p>
              </div>
            ) : (
              <motion.div
                ref={fileGridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
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

        {/* Conclusion Section */}
        <motion.section 
          className="card-leaf"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Key Takeaway
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            This simulation shows how Ant Colony Optimization improves antivirus efficiency 
            by prioritizing high-risk files. Just like ants concentrate on the best food sources, 
            scanning agents focus their resources on infected files, making virus detection 
            <span className="text-foreground font-semibold"> faster and more effective</span>.
          </p>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-muted/20">
        <div className="section-container text-center">
          <p className="text-sm text-muted-foreground">
            Educational Demonstration of Ant Colony Optimization
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-2">
            🐜 Inspired by nature, applied to cybersecurity 🛡️
          </p>
        </div>
      </footer>

      {/* Detection Alert - Only for infected files */}
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
