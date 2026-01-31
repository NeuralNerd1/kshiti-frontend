import api from "../api";

/* -------------------------------
   CREATE ELEMENT
-------------------------------- */
export const createElement = async (payload: {
  folder_id: number;
  name: string;
  page_url?: string | null;
  locators: {
    selector_type: string;
    selector_value: string;
  }[];
}) => {
  const res = await api.post(
    "/planning/elements/",
    payload
  );
  return res.data;
};

/* -------------------------------
   LIST ELEMENTS
-------------------------------- */
export const listElements = async (
  projectId: number,
  folderId?: number
) => {
  const params: any = {
    project_id: projectId,
  };

  if (folderId) {
    params.folder_id = folderId;
  }

  const res = await api.get(
    "/planning/elements/list/",
    { params }
  );

  return res.data;
};
/* -------------------------------
   GET ELEMENT DETAIL
-------------------------------- */
export const getElementDetail = async (
  elementId: number
) => {
  const res = await api.get(
    `/planning/elements/${elementId}/`
  );
  return res.data;
};

/* -------------------------------
   UPDATE ELEMENT
-------------------------------- */
export async function updateElement(
  elementId: number,
  data: {
    name: string;
    page_url?: string;
    locators: any[];
    originalLocators: any[];
  }
) {
  const update: any[] = [];
  const create: any[] = [];
  const deleteIds: number[] = [];

  const originalMap = new Map(
    data.originalLocators.map((l: any) => [l.id, l])
  );

  const editedIds = new Set<number>();

  for (const loc of data.locators) {
    if (loc.id) {
      editedIds.add(loc.id);

      const original = originalMap.get(loc.id);

      if (
        original.selector_type !== loc.selector_type ||
        original.selector_value !== loc.selector_value
      ) {
        update.push({
          id: loc.id,
          selector_type: loc.selector_type,
          selector_value: loc.selector_value,
        });
      }
    } else {
      create.push({
        selector_type: loc.selector_type,
        selector_value: loc.selector_value,
      });
    }
  }

  // deleted locators
  for (const orig of data.originalLocators) {
    if (!editedIds.has(orig.id)) {
      deleteIds.push(orig.id);
    }
  }

  const payload: any = {
    locators: {
      update,
      create,
      delete: deleteIds,
    },
  };

  // ⚠️ only send name if changed
  if (data.name !== undefined) {
    payload.name = data.name;
  }

  if (data.page_url !== undefined) {
    payload.page_url = data.page_url;
  }

  const res = await api.patch(
    `/planning/elements/${elementId}/edit/`,
    payload
  );

  return res.data;
}

/* -------------------------------
   DELETE ELEMENT
-------------------------------- */
export const deleteElement = async (
  elementId: number
) => {
  const res = await api.delete(
    `/planning/elements/${elementId}/delete/`
  );
  return res.data;
};
