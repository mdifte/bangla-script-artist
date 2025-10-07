import { Brain, CheckCircle, Clock } from "lucide-react";

interface ClassificationResult {
  class_id: number;
  class_name: string;
  typed_juktoborno: string;
  description: string;
  folder: string;
  confidence: number;
}

interface ClassificationResultsProps {
  isLoading: boolean;
  results: {
    predicted_class_id: number;
    predicted_class_name: string;
    typed_juktoborno: string;
    described: string;
    confidence: number;
    top_predictions: ClassificationResult[];
  } | null;
  inputImage: string | null;
}

const ClassificationResults = ({ isLoading, results, inputImage }: ClassificationResultsProps) => {
  if (!inputImage && !isLoading) {
    return (
      <div className="bg-gradient-card rounded-xl p-8 border border-border/50 text-center">
        <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-card-foreground mb-2">
          Ready for Classification
        </h3>
        <p className="text-muted-foreground">
          Upload an image, take a photo, or draw a compound character to see AI predictions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input image preview */}
      {inputImage && (
        <div className="bg-gradient-card rounded-xl p-4 border border-border/50">
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Input Image</h3>
          <div className="bg-white rounded-lg p-4 border border-border/20">
            <img
              src={inputImage}
              alt="Input character"
              className="w-full max-h-32 object-contain"
            />
          </div>
        </div>
      )}

      {/* Results section */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isLoading ? 'bg-accent/20' : 'bg-primary-soft'
          }`}>
            {isLoading ? (
              <Clock className="w-5 h-5 text-accent-foreground animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5 text-primary" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-card-foreground">
            {isLoading ? 'Processing...' : 'Classification Results'}
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <p className="text-muted-foreground text-sm">
              AI model is analyzing the compound character...
            </p>
          </div>
        ) : results ? (
          <div className="space-y-4">
            {results.top_predictions.map((result, index) => (
              <div
                key={`${result.class_id}-${index}`}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  index === 0 
                    ? 'bg-primary-soft border-primary/30 shadow-soft' 
                    : 'bg-muted/30 border-border/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-4xl font-bold text-card-foreground">
                      {result.typed_juktoborno}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {result.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Class ID: {result.class_id} | Folder: {result.folder}
                      </p>
                      {index === 0 && (
                        <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full mt-1">
                          Best Match
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-card-foreground">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-500 ${
                          index === 0 ? 'bg-primary' : 'bg-secondary-dark'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-accent/10 rounded-lg p-3 mt-4">
              <p className="text-sm text-accent-foreground">
                <strong>Note:</strong> Powered by your AI model at snake-positive-tightly.ngrok-free.app
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No results to display
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassificationResults;