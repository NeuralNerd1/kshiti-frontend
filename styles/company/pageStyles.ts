import type { CSSProperties } from "react";

export const pageStyles: {
  container: CSSProperties;
  leftPane: CSSProperties;
  brandOverlay: CSSProperties;
  brandTitle: CSSProperties;
  brandSubtitle: CSSProperties;
  rightPane: CSSProperties;
  card: CSSProperties;
  heading: CSSProperties;
  helper: CSSProperties;
} = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },

  leftPane: {
    position: "relative",
    backgroundImage: "url('/branding/aca-hero.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  brandOverlay: {
    position: "absolute",
    bottom: "48px",
    left: "48px",
    color: "#ffffff",
    maxWidth: "480px",
  },

  brandTitle: {
    fontSize: "36px",
    fontWeight: 600,
    marginBottom: "12px",
  },

  brandSubtitle: {
    fontSize: "16px",
    opacity: 0.9,
    lineHeight: 1.5,
  },

  rightPane: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    backgroundColor: "#f9fafb",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },

  heading: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#111827",
  },

  helper: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },
};
