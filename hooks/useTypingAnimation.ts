import { useState, useEffect, useRef } from 'react';

export function useTypingAnimation(texts: string[], isActive: boolean = true) {
  const [displayText, setDisplayText] = useState<string>('');
  const currentIndexRef = useRef<number>(0);
  const currentPositionRef = useRef<number>(0);
  const isDeletingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isActive) {
      // Clear any pending timeout when deactivated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const animate = () => {
      const currentText = texts[currentIndexRef.current];
      const currentPos = currentPositionRef.current;
      const isDeleting = isDeletingRef.current;

      let nextText: string;
      let delay: number;

      if (!isDeleting) {
        // Typing mode
        if (currentPos < currentText.length) {
          // Continue typing
          currentPositionRef.current++;
          nextText = currentText.slice(0, currentPos + 1);
          // Random typing speed between 15-30ms for faster animation
          delay = Math.random() * 15 + 15;
        } else {
          // Finished typing, pause before deleting
          nextText = currentText;
          isDeletingRef.current = true;
          delay = 2000;
        }
      } else {
        // Deleting mode
        if (currentPos > 0) {
          // Continue deleting
          currentPositionRef.current--;
          nextText = currentText.slice(0, currentPos - 1);
          // Delete speed between 10-25ms for faster deletion
          delay = Math.random() * 15 + 10;
        } else {
          // Finished deleting, move to next text
          nextText = '';
          isDeletingRef.current = false;
          currentIndexRef.current = (currentIndexRef.current + 1) % texts.length;
          currentPositionRef.current = 0;
          delay = 500;
        }
      }

      // Update state
      setDisplayText(nextText);

      // Schedule next animation step
      timeoutRef.current = setTimeout(animate, delay);
    };

    // Start animation
    animate();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [texts, isActive]);

  return displayText;
}

