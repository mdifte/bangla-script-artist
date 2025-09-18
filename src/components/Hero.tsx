import { FileImage, Camera, PenTool } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-warm flex items-center justify-center px-4 overflow-hidden">
      {/* Bengali-inspired decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-saffron rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-teal rounded-full opacity-10 blur-3xl"></div>
      
      {/* Floating Bengali Juktoborno Characters */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Character 1: ক্ত */}
        <div className="absolute top-20 left-10 text-6xl text-primary/10 animate-float-slow">
          ক্ত
        </div>
        
        {/* Character 2: ন্দ */}
        <div className="absolute top-40 right-16 text-4xl text-secondary/15 animate-float-medium delay-1000">
          ন্দ
        </div>
        
        {/* Character 3: ষ্ট */}
        <div className="absolute bottom-32 left-20 text-5xl text-accent/12 animate-float-fast delay-2000">
          ষ্ট
        </div>
        
        {/* Character 4: ক্ষ */}
        <div className="absolute top-60 left-1/3 text-7xl text-primary/8 animate-float-slow delay-3000">
          ক্ষ
        </div>
        
        {/* Character 5: ঞ্জ */}
        <div className="absolute bottom-20 right-32 text-4xl text-secondary/10 animate-float-medium delay-4000">
          ঞ্জ
        </div>
        
        {/* Character 6: স্ত */}
        <div className="absolute top-32 right-1/4 text-5xl text-accent/15 animate-float-fast delay-500">
          স্ত
        </div>
        
        {/* Character 7: ম্ব */}
        <div className="absolute bottom-60 left-1/2 text-6xl text-primary/12 animate-float-slow delay-1500">
          ম্ব
        </div>
        
        {/* Character 8: র্ক */}
        <div className="absolute top-80 right-10 text-4xl text-secondary/8 animate-float-medium delay-2500">
          র্ক
        </div>
      </div>
      
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