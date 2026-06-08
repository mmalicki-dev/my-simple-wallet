import { useState } from "react";

export function useSectionState<T>() {
  const [selected, setSelected] = useState<T | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  return { selected, setSelected, isAdding, setIsAdding };
}
