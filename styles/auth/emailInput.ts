export const emailInputStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
  },

  input: {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    backgroundColor: "#ffffff",
  },

  inputDisabled: {
    backgroundColor: "#f3f4f6",
    cursor: "not-allowed",
  },
};
