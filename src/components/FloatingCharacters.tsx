import { useEffect, useState } from "react";

const characters = [
  "ক্ব", "ণ্ব", "ধ্ন", "স্ব", "গ্ধ", "গ্ন", "স্ল", "গ্ব", "গ্ম", "হ্ল",
  "ক্ষ", "ঙ্ঘ", "চ্ছ্ব", "জ্জ্ব", "ল্ক", "স্প", "ল্ত", "স্ট", "স্থ", "ণ্ট",
  "ন্ত", "ণ্ঢ", "ণ্ন", "ন্ম", "ষ্ম", "ত্ব", "ত্ম", "ষ্ব", "ষ্ফ", "থ্ব"
];

interface FloatingChar {
  id: number;
  char: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

const FloatingCharacters = () => {
  const [floatingChars, setFloatingChars] = useState<FloatingChar[]>([]);

  useEffect(() => {
    const chars: FloatingChar[] = [];
    for (let i = 0; i < 20; i++) {
      chars.push({
        id: i,
        char: characters[Math.floor(Math.random() * characters.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 5,
        size: 1.5 + Math.random() * 2.5
      });
    }
    setFloatingChars(chars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
      {floatingChars.map((item) => (
        <div
          key={item.id}
          className="absolute text-primary font-bold animate-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            animation: `float ${item.duration}s ease-in-out ${item.delay}s infinite`,
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
};

export default FloatingCharacters;
