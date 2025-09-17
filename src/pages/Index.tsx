import { useEffect } from "react";
import Hero from "@/components/Hero";
import ClassifierInterface from "@/components/ClassifierInterface";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // SEO optimization
    document.title = "যুক্তবর্ণ AI - Bengali Compound Character Classification";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Advanced AI model for Bengali compound character (juktoborno) recognition. Upload, capture, or draw Bengali characters for instant classification with high accuracy.'
      );
    }

    // Add structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "যুক্তবর্ণ AI Classifier",
      "description": "AI-powered Bengali compound character classification tool",
      "url": window.location.href,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <ClassifierInterface />
      <Footer />
    </main>
  );
};

export default Index;
