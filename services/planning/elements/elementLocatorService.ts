import api from "../api";

/* -------------------------------
   UPDATE LOCATOR
-------------------------------- */
export const updateLocator = async (
  locatorId: number,
  payload: {
    selector_value?: string;
    is_active?: boolean;
  }
) => {
  const res = await api.patch(
    `/planning/elements/locators/${locatorId}/`,
    payload
  );
  return res.data;
};

/* -------------------------------
   DELETE LOCATOR
-------------------------------- */
export const deleteLocator = async (
  locatorId: number
) => {
  const res = await api.delete(
    `/planning/elements/locators/${locatorId}/delete/`
  );
  return res.data;
};
