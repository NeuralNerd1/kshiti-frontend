import api from "../api";

export interface VariableFolder {
  id: number;
  name: string;
  parent_id?: number | null;
  project_id: number;
}

/* ======================================================
   LIST FOLDERS ✅ CORRECT ENDPOINT
====================================================== */

export const getVariableFolders = async (
  project_id: number
) => {
  const res = await api.get(
    "/planning/variables/folders/list/",
    {
      params: { project_id },
    }
  );

  return res.data as VariableFolder[];
};

/* ======================================================
   CREATE FOLDER
====================================================== */

export const createVariableFolder = async (data: {
  project_id: number;
  name: string;
  parent_id?: number;
}) => {
  const res = await api.post(
    "/planning/variables/folders/",
    data
  );

  return res.data as VariableFolder;
};

/* ======================================================
   UPDATE FOLDER
====================================================== */

export const updateVariableFolder = async (
  id: number,
  name: string
) => {
  const res = await api.patch(
    `/planning/variables/folders/${id}/`,
    { name }
  );

  return res.data as VariableFolder;
};

/* ======================================================
   DELETE FOLDER
====================================================== */

export const deleteVariableFolder = async (id: number) => {
  await api.delete(
    `/planning/variables/folders/${id}/delete/`
  );
};
