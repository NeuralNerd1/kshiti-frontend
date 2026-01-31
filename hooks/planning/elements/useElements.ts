import { useCallback, useEffect, useState } from "react";
import { listElements } from "@/services/planning/elements/elementService";

export interface ElementItem {
  id: number;
  name: string;
  folder_id: number;
  page_url?: string | null;
  locators: any[];
}

export function useElements(
  projectId?: number | null,
  folderId?: number
) {
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchElements = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const data = await listElements(
        projectId,
        folderId
      );
      setElements(data);
    } finally {
      setLoading(false);
    }
  }, [projectId, folderId]);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  return {
    elements,
    loading,
    refresh: fetchElements,
  };
}
