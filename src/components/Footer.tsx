import { Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Project info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">যুক্তবর্ণ AI</h3>
            <p className="text-background/80 leading-relaxed">
              Advanced machine learning model for Bengali compound character recognition. 
              Bridging traditional script with modern AI technology.
            </p>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Technology</h4>
            <ul className="space-y-2 text-background/80">
              <li>• Deep Learning Classification</li>
              <li>• Computer Vision</li>
              <li>• React & TypeScript</li>
              <li>• Canvas API Integration</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Github className="w-5 h-5 text-primary" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Mail className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-accent" /> for Bengali language preservation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;