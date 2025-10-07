import * as ort from 'onnxruntime-web';

export interface ClassMapping {
  classNumber: number;
  typedJuktoborno: string;
  described: string;
  folder: string;
}

let modelSession: ort.InferenceSession | null = null;
let classMappings: ClassMapping[] = [];

// Parse CSV mappings
export const loadMappings = async (): Promise<ClassMapping[]> => {
  if (classMappings.length > 0) return classMappings;
  
  const response = await fetch('/models/mappings.csv');
  const text = await response.text();
  const lines = text.split('\n').slice(1); // Skip header
  
  classMappings = lines
    .filter(line => line.trim())
    .map(line => {
      const [classNumber, typedJuktoborno, described, folder] = line.split(',');
      return {
        classNumber: parseInt(classNumber),
        typedJuktoborno: typedJuktoborno.trim(),
        described: described.trim(),
        folder: folder.trim()
      };
    });
  
  return classMappings;
};

// Load ONNX model
export const loadModel = async (onProgress?: (progress: number) => void): Promise<void> => {
  if (modelSession) return;
  
  try {
    // Configure WASM paths
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/';
    
    // Simulate progress for model loading
    onProgress?.(0.3);
    
    modelSession = await ort.InferenceSession.create('/models/efficientnet_b0_best.onnx', {
      executionProviders: ['wasm'],
    });
    
    onProgress?.(0.7);
    
    // Load mappings
    await loadMappings();
    
    onProgress?.(1.0);
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
};

// Preprocess image for model input
const preprocessImage = async (imageData: string): Promise<ort.Tensor> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas for preprocessing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Model expects 256x256 grayscale input
      const targetSize = 256;
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      // Draw and resize image
      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
      const { data } = imageData;
      
      // Convert to grayscale and normalize [0, 255] -> [0, 1]
      const float32Data = new Float32Array(targetSize * targetSize);
      
      for (let i = 0; i < targetSize * targetSize; i++) {
        // Convert RGB to grayscale using luminosity method
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
        float32Data[i] = grayscale / 255.0;
      }
      
      // Create tensor [1, 1, 256, 256]
      const tensor = new ort.Tensor('float32', float32Data, [1, 1, targetSize, targetSize]);
      resolve(tensor);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
};

// Run inference
export const classifyImage = async (imageData: string, topK: number = 5) => {
  if (!modelSession) {
    throw new Error('Model not loaded. Call loadModel() first.');
  }
  
  // Preprocess image
  const inputTensor = await preprocessImage(imageData);
  
  // Run inference
  const feeds = { [modelSession.inputNames[0]]: inputTensor };
  const results = await modelSession.run(feeds);
  
  // Get output tensor
  const output = results[modelSession.outputNames[0]];
  const predictions = output.data as Float32Array;
  
  // Get top K predictions
  const indexed = Array.from(predictions).map((score, idx) => ({ score, idx }));
  indexed.sort((a, b) => b.score - a.score);
  
  const topPredictions = indexed.slice(0, topK).map(({ score, idx }) => {
    const mapping = classMappings.find(m => m.classNumber === idx);
    return {
      class_id: idx,
      class_name: mapping?.typedJuktoborno || `Class ${idx}`,
      typed_juktoborno: mapping?.typedJuktoborno || `Class ${idx}`,
      description: mapping?.described || '',
      confidence: score
    };
  });
  
  return {
    typed_juktoborno: topPredictions[0].typed_juktoborno,
    predictions: topPredictions
  };
};
