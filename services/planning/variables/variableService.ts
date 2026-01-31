import api from "../api";

export interface Variable {
  id: number;
  key: string;
  value: string;
  description?: string;
  folder_id: number;
}

/* ======================================================
   LIST VARIABLES ✅ CORRECT ENDPOINT
====================================================== */

export const getVariables = async (params: {
  project_id: number;
  folder_id?: number;
}) => {
  const res = await api.get(
    "/planning/variables/list/",
    { params }
  );

  return res.data as Variable[];
};

/* ======================================================
   CREATE VARIABLE
====================================================== */

export const createVariable = async (data: {
  folder_id: number;
  key: string;
  value: string;
  description?: string;
}) => {
  const res = await api.post(
    "/planning/variables/",
    data
  );

  return res.data as Variable;
};

/* ======================================================
   UPDATE VARIABLE
====================================================== */

export const updateVariable = async (
  id: number,
  data: {
    value?: string;
    description?: string;
  }
) => {
  const res = await api.patch(
    `/planning/variables/${id}/`,
    data
  );

  return res.data as Variable;
};

/* ======================================================
   DELETE VARIABLE
====================================================== */

export const deleteVariable = async (id: number) => {
  await api.delete(
    `/planning/variables/${id}/delete/`
  );
};
