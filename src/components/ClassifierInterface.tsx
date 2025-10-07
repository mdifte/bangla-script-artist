import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ImageUpload from "./ImageUpload";
import CameraCapture from "./CameraCapture";
import DrawingCanvas from "./DrawingCanvas";
import ClassificationResults from "./ClassificationResults";
import { toast } from "sonner";
import { loadModel, classifyImage } from "@/lib/onnxClassifier";


const ClassifierInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [modelLoading, setModelLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const initModel = async () => {
      try {
        await loadModel((progress) => {
          setLoadingProgress(progress * 100);
        });
        toast.success("AI model loaded and ready!");
        setModelLoading(false);
      } catch (error) {
        console.error("Failed to load model:", error);
        toast.error("Failed to load AI model");
        setModelLoading(false);
      }
    };
    initModel();
  }, []);

  const handleImageProcess = async (imageData: string) => {
    setInputImage(imageData);
    setIsLoading(true);
    setResults(null);

    try {
      toast.loading("Processing image with AI model...");
      
      const classificationResults = await classifyImage(imageData, 5);
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
      handleImageProcess(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (imageData: string) => {
    handleImageProcess(imageData);
  };

  const handleDrawingComplete = (imageData: string) => {
    handleImageProcess(imageData);
  };

  if (modelLoading) {
    return (
      <section id="classifier" className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Loading AI Model
            </h2>
            <p className="text-muted-foreground mb-6">
              Preparing the Bengali character classifier...
            </p>
          </div>
          <Progress value={loadingProgress} className="w-full h-3" />
          <p className="text-center text-sm text-muted-foreground">
            {Math.round(loadingProgress)}% complete
          </p>
        </div>
      </section>
    );
  }

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