"use client";

import { colors, spacing, radius, typography } from "@/styles/tokens";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const background =
    variant === "danger" ? colors.danger : colors.primary;

  const hoverBackground =
    variant === "danger" ? "#991b1b" : colors.primaryHover;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        width: "100%",
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: radius.md,
        border: "none",
        backgroundColor: background,
        color: colors.textInverse,
        fontFamily: typography.fontFamily,
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.medium,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.7 : 1,
        transition: "background-color 0.15s ease",
      }}
      onMouseOver={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = hoverBackground;
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = background;
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
