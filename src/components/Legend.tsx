const Legend = () => {
  return (
    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
      <h3 className="font-semibold text-foreground mb-3 text-sm">Legend / Key</h3>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <div className="legend-dot legend-dot-safe" />
          <span className="text-sm text-muted-foreground">🟢 Safe File</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="legend-dot legend-dot-infected" />
          <span className="text-sm text-muted-foreground">🔴 Infected File</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🐜</span>
          <span className="text-sm text-muted-foreground">Scanning Agent (Ant)</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
