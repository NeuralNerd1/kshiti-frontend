"use client";

import { colors, spacing, radius, typography } from "@/styles/tokens";

type InputProps = {
  label?: string;
  type?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function Input({
  label,
  type = "text",
  value,
  placeholder,
  disabled = false,
  onChange,
}: InputProps) {
  return (
    <div style={{ display: "grid", gap: spacing.xs }}>
      {label && (
        <label
          style={{
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
            color: colors.textSecondary,
          }}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${colors.borderSubtle}`,
          fontFamily: typography.fontFamily,
          fontSize: typography.sizes.base,
          color: colors.textPrimary,
          outline: "none",
          backgroundColor: disabled ? colors.surface : colors.white,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.focusRing;
          e.currentTarget.style.boxShadow = `0 0 0 1px ${colors.focusRing}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.borderSubtle;
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
