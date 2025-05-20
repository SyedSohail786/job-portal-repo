import { useState } from 'react';
import Typewriter from 'typewriter-effect';

export default function HeroTypingText() {
  const [showStaticText, setShowStaticText] = useState(false);

  return (
    <div className="text-white text-2xl md:text-4xl font-bold text-center mt-6">
      {!showStaticText ? (
        <Typewriter
          options={{
            delay: 70,
            cursor: '',
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString('Over 10,000+ jobs to apply!!')
              .callFunction(() => setShowStaticText(true))
              .start();
          }}
        />
      ) : (
        <p>Over 10,000+ jobs to apply!!</p>
      )}
    </div>
  );
}
