import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
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

    // Initialize the PencilBrush - this is required in Fabric.js v6
    const brush = new PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;

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
    
    // Get the canvas as a data URL first
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Export the fabric canvas to an image
    const fabricImage = new Image();
    fabricImage.onload = () => {
      // Draw to temp canvas to get pixel data
      tempCanvas.width = fabricImage.width;
      tempCanvas.height = fabricImage.height;
      tempCtx.drawImage(fabricImage, 0, 0);
      
      // Get image data to find bounding box of drawn content
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;
      
      let minX = tempCanvas.width;
      let minY = tempCanvas.height;
      let maxX = 0;
      let maxY = 0;
      
      // Find bounding box of non-white pixels
      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const i = (y * tempCanvas.width + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Check if pixel is not white (drawn content)
          if (r < 250 || g < 250 || b < 250) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      
      // Add small padding
      const padding = 10;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(tempCanvas.width, maxX + padding);
      maxY = Math.min(tempCanvas.height, maxY + padding);
      
      const width = maxX - minX;
      const height = maxY - minY;
      
      // Create cropped canvas
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) return;
      
      // Draw cropped region
      croppedCtx.drawImage(
        tempCanvas,
        minX, minY, width, height,
        0, 0, width, height
      );
      
      // Invert colors: white drawing on black background for AI
      const croppedImageData = croppedCtx.getImageData(0, 0, width, height);
      const croppedPixels = croppedImageData.data;
      
      for (let i = 0; i < croppedPixels.length; i += 4) {
        croppedPixels[i] = 255 - croppedPixels[i];       // R
        croppedPixels[i + 1] = 255 - croppedPixels[i + 1]; // G
        croppedPixels[i + 2] = 255 - croppedPixels[i + 2]; // B
      }
      
      croppedCtx.putImageData(croppedImageData, 0, 0);
      
      // Export as data URL
      const finalImageData = croppedCanvas.toDataURL('image/jpeg', 0.8);
      onDrawingComplete(finalImageData);
      toast.success("Drawing exported for classification!");
    };
    
    fabricImage.src = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 2,
    });
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