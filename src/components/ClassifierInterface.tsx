import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "./ImageUpload";
import CameraCapture from "./CameraCapture";
import DrawingCanvas from "./DrawingCanvas";
import ClassificationResults from "./ClassificationResults";
import { toast } from "sonner";

// Mock classification function - replace with actual AI model
const mockClassification = async (imageData: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock results for demonstration
  return [
    { character: "ক্ষ", confidence: 0.95, romanization: "kṣa" },
    { character: "ত্র", confidence: 0.87, romanization: "tra" },
    { character: "জ্ঞ", confidence: 0.73, romanization: "gy" },
    { character: "দ্ব", confidence: 0.68, romanization: "dwa" },
    { character: "স্থ", confidence: 0.45, romanization: "stha" },
  ];
};

const ClassifierInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleImageProcess = async (imageData: string, source: string) => {
    setInputImage(imageData);
    setIsLoading(true);
    setResults(null);

    try {
      toast.loading("Processing image with AI model...");
      const classificationResults = await mockClassification(imageData);
      setResults(classificationResults);
      toast.dismiss();
      toast.success(`Classification complete! Found ${classificationResults.length} predictions.`);
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
      handleImageProcess(imageData, "upload");
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (imageData: string) => {
    handleImageProcess(imageData, "camera");
  };

  const handleDrawingComplete = (imageData: string) => {
    handleImageProcess(imageData, "drawing");
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