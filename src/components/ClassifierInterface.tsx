import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "./ImageUpload";
import CameraCapture from "./CameraCapture";
import DrawingCanvas from "./DrawingCanvas";
import ClassificationResults from "./ClassificationResults";
import { toast } from "sonner";

// Convert data URL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Real API classification function
const classifyImage = async (imageFile: File | Blob, topK: number = 5) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch(
    `https://snake-positive-tightly.ngrok-free.app/predict?top_k=${topK}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

const ClassifierInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleImageProcess = async (imageSource: File | Blob | string, displayImage: string) => {
    setInputImage(displayImage);
    setIsLoading(true);
    setResults(null);

    try {
      toast.loading("Processing image with AI model...");
      
      // Convert to Blob if it's a data URL
      const imageFile = typeof imageSource === 'string' 
        ? dataURLtoBlob(imageSource)
        : imageSource;
      
      const classificationResults = await classifyImage(imageFile, 5);
      setResults(classificationResults);
      toast.dismiss();
      toast.success(`Classification complete! Top prediction: ${classificationResults.typed_juktoborno}`);
    } catch (error) {
      console.error("Classification error:", error);
      toast.dismiss();
      toast.error("Classification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      handleImageProcess(file, imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (imageData: string) => {
    handleImageProcess(imageData, imageData);
  };

  const handleDrawingComplete = (imageData: string) => {
    handleImageProcess(imageData, imageData);
  };

  return (
    <section id="classifier" className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="bg-gradient-saffron bg-clip-text text-transparent">
              AI Classification
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your preferred input method and let our AI model identify Bengali compound characters
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input methods */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto">
                <TabsTrigger 
                  value="upload" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger 
                  value="camera" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  Camera
                </TabsTrigger>
                <TabsTrigger 
                  value="draw" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  Draw
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <ImageUpload onImageSelect={handleFileUpload} />
              </TabsContent>

              <TabsContent value="camera" className="mt-6">
                <CameraCapture onImageCapture={handleCameraCapture} />
              </TabsContent>

              <TabsContent value="draw" className="mt-6">
                <DrawingCanvas onDrawingComplete={handleDrawingComplete} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Results */}
          <div>
            <ClassificationResults 
              isLoading={isLoading}
              results={results}
              inputImage={inputImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassifierInterface;