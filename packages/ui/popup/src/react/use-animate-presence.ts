import { useEffect, useRef, useState } from 'react';

export interface UseAnimatePresenceProps {
  isOpen: boolean;
  duration?: number;
}

export function useAnimatePresence(props: UseAnimatePresenceProps) {
  const { isOpen, duration = 500 } = props;

  const [isVisible, setIsVisible] = useState(Boolean(isOpen));
  const [isClosing, setIsClosing] = useState(false);

  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (!isOpen) {
        setIsVisible(false);
        setIsClosing(false);
      }
      return;
    }

    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      return;
    }

    if (!isVisible) {
      setIsClosing(false);
      return;
    }

    setIsClosing(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, isVisible, duration]);

  return {
    isVisible,
    isClosing,
  };
}
