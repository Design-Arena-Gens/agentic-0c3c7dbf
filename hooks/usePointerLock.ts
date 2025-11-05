import { useEffect, useState } from 'react';

export const usePointerLock = (elementRef: React.RefObject<HTMLElement>, enabled: boolean) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!elementRef.current || !enabled) return;

    const element = elementRef.current;

    const handlePointerLockChange = () => {
      setIsLocked(document.pointerLockElement === element);
    };

    const handleClick = () => {
      if (!isLocked && enabled) {
        element.requestPointerLock();
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    element.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      element.removeEventListener('click', handleClick);
      if (document.pointerLockElement === element) {
        document.exitPointerLock();
      }
    };
  }, [elementRef, enabled, isLocked]);

  return isLocked;
};
