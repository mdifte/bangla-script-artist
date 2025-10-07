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
        typedJuktoborno: typedJuktoborno?.trim() || '',
        described: described?.trim() || '',
        folder: folder?.trim() || ''
      };
    });
  
  console.log('Loaded mappings:', classMappings.length);
  console.log('Sample mappings:');
  classMappings.slice(0, 10).forEach(m => {
    console.log(`  Class ${m.classNumber} [Folder ${m.folder}]: ${m.typedJuktoborno} (${m.described})`);
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
      
      // Model expects 128x128 grayscale input
      const targetSize = 128;
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
      
      // Create tensor [1, 1, 128, 128]
      const tensor = new ort.Tensor('float32', float32Data, [1, 1, targetSize, targetSize]);
      resolve(tensor);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
};

// Softmax function to convert logits to probabilities
const softmax = (logits: Float32Array): Float32Array => {
  const maxLogit = Math.max(...Array.from(logits));
  const expScores = logits.map(logit => Math.exp(logit - maxLogit));
  const sumExpScores = expScores.reduce((a, b) => a + b, 0);
  return new Float32Array(expScores.map(score => score / sumExpScores));
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
  const rawPredictions = output.data as Float32Array;
  
  // Debug: Log raw predictions (logits)
  console.log('=== ONNX Model Output Debug ===');
  console.log('Model output shape:', output.dims);
  console.log('Total classes:', rawPredictions.length);
  console.log('Total mappings loaded:', classMappings.length);
  console.log('Output type:', output.type);
  
  // Check if we need to apply softmax (if values are logits)
  const maxValue = Math.max(...Array.from(rawPredictions));
  const minValue = Math.min(...Array.from(rawPredictions));
  const sumValues = Array.from(rawPredictions).reduce((a, b) => a + b, 0);
  
  console.log('\nRaw output statistics:');
  console.log(`  Min value: ${minValue.toFixed(4)}`);
  console.log(`  Max value: ${maxValue.toFixed(4)}`);
  console.log(`  Sum of values: ${sumValues.toFixed(4)}`);
  
  // Apply softmax if values don't sum to ~1 (indicating they're logits, not probabilities)
  let predictions: Float32Array;
  if (Math.abs(sumValues - 1.0) > 0.1) {
    console.log('  → Applying softmax (values appear to be logits)');
    predictions = softmax(rawPredictions);
  } else {
    console.log('  → Using raw values (already normalized)');
    predictions = rawPredictions;
  }
  
  // Get top K predictions
  const indexed = Array.from(predictions).map((score, idx) => ({ score, idx }));
  indexed.sort((a, b) => b.score - a.score);
  
  // Debug: Show top 10 raw predictions
  console.log('\nTop 10 raw predictions (class number from model: confidence):');
  indexed.slice(0, 10).forEach(({ idx, score }) => {
    const mapping = classMappings.find(m => m.classNumber === idx);
    console.log(`  Class ${idx}: ${(score * 100).toFixed(2)}% ${mapping ? `→ ${mapping.typedJuktoborno} [Folder ${mapping.folder}]` : '(no mapping)'}`);
  });
  
  const topPredictions = indexed.slice(0, topK).map(({ score, idx }) => {
    // Model outputs class numbers (0, 1, 10, 100, etc.)
    // Find the mapping by class number
    const mapping = classMappings.find(m => m.classNumber === idx);
    
    // Debug: Log mapping details
    if (!mapping) {
      console.warn(`⚠️ No mapping found for class ${idx}`);
    }
    
    return {
      class_id: idx,
      class_name: mapping?.typedJuktoborno || `Class ${idx}`,
      typed_juktoborno: mapping?.typedJuktoborno || `Class ${idx}`,
      description: mapping?.described || 'No description',
      folder: mapping?.folder || 'N/A',
      confidence: score
    };
  });
  
  // Debug: Show mapped predictions
  console.log('\nTop predictions with mappings:');
  topPredictions.forEach((pred, i) => {
    console.log(`  ${i + 1}. [Class ${pred.class_id}, Folder ${pred.folder}] ${pred.typed_juktoborno} (${pred.description}) - ${(pred.confidence * 100).toFixed(2)}%`);
  });
  console.log('=== End Debug ===\n');
  
  return {
    predicted_class_id: topPredictions[0].class_id,
    predicted_class_name: topPredictions[0].class_name,
    typed_juktoborno: topPredictions[0].typed_juktoborno,
    described: topPredictions[0].description,
    confidence: topPredictions[0].confidence,
    top_predictions: topPredictions
  };
};
