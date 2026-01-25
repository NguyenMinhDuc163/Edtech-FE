import { useRef, useState } from "react";

export function useDraggableScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.cursor = "grab";
      ref.current.style.removeProperty("user-select");
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseLeave = () => {
    if (isDragging) onMouseUp();
  };

  return { ref, onMouseDown, onMouseUp, onMouseMove, onMouseLeave };
}
