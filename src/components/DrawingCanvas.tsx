import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Eraser, RotateCcw, Download, Palette } from "lucide-react";
import { toast } from "sonner";

interface DrawingCanvasProps {
  onDrawingComplete: (imageData: string) => void;
}

const DrawingCanvas = ({ onDrawingComplete }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState("#2D3748");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 300,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Wait for canvas to be fully initialized before configuring brush
    setTimeout(() => {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
      }
    }, 100);

    setFabricCanvas(canvas);
    toast.success("Drawing canvas ready!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas || !fabricCanvas.freeDrawingBrush) return;
    
    fabricCanvas.freeDrawingBrush.width = brushSize;
    fabricCanvas.freeDrawingBrush.color = brushColor;
  }, [brushSize, brushColor, fabricCanvas]);

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const exportDrawing = () => {
    if (!fabricCanvas) return;
    
    const imageData = fabricCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.8,
      multiplier: 2, // Higher resolution
    });
    
    onDrawingComplete(imageData);
    toast.success("Drawing exported for classification!");
  };

  const toggleDrawingMode = () => {
    if (!fabricCanvas) return;
    
    const newMode = !fabricCanvas.isDrawingMode;
    fabricCanvas.isDrawingMode = newMode;
    setIsDrawing(newMode);
    
    if (newMode) {
      toast.success("Drawing mode enabled");
    } else {
      toast.success("Selection mode enabled");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-card rounded-xl p-6 border border-border/50">
        {/* Canvas */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden border border-border/20 mb-4">
          <canvas 
            ref={canvasRef} 
            className="block mx-auto"
          />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Brush settings */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent-foreground" />
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Brush Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground w-6">{brushSize}px</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={toggleDrawingMode}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                isDrawing 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <Eraser className="w-4 h-4" />
              {isDrawing ? 'Drawing' : 'Select'}
            </button>
            
            <button
              onClick={clearCanvas}
              className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-all duration-300 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
            
            <button
              onClick={exportDrawing}
              className="bg-gradient-saffron text-primary-foreground px-4 py-2 rounded-lg font-medium hover:shadow-medium transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Use Drawing
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
        <p>Draw Bengali compound characters clearly. Use a larger brush size for better recognition.</p>
      </div>
    </div>
  );
};

export default DrawingCanvas;