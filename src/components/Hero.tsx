import { FileImage, Camera, PenTool } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-warm flex items-center justify-center px-4">
      {/* Bengali-inspired decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-saffron rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-teal rounded-full opacity-10 blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto text-center">
        {/* Main heading with Bengali aesthetic */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-saffron bg-clip-text text-transparent">যুক্তবর্ণ</span>
            <br />
            <span className="text-secondary-dark">AI Classifier</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced AI model for recognizing and classifying Bengali compound characters (juktoborno). 
            Upload, capture, or draw to experience the power of modern machine learning.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gradient-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary-soft rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FileImage className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Upload Image</h3>
            <p className="text-muted-foreground">
              Upload a clear image of Bengali compound characters for instant classification
            </p>
          </div>

          <div className="bg-gradient-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300 group">
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Camera className="w-8 h-8 text-secondary-dark" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Camera Capture</h3>
            <p className="text-muted-foreground">
              Use your device camera to capture compound characters in real-time
            </p>
          </div>

          <div className="bg-gradient-card p-8 rounded-2xl shadow-soft border border-border/50 hover:shadow-medium transition-all duration-300 group">
            <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
              <PenTool className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-3">Draw Canvas</h3>
            <p className="text-muted-foreground">
              Draw compound characters directly on our interactive canvas
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button 
            onClick={() => document.getElementById('classifier')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-saffron text-primary-foreground px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            Start Classifying
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;