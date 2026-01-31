export const authBaseStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: "16px",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
  },

  header: {
    marginBottom: "20px",
    textAlign: "center" as const,
  },

  title: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#111827",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  footerError: {
    marginTop: "10px",
    textAlign: "left" as const,
  },
};
