"use client";

import { emailInputStyles as styles } from "@/styles/auth/emailInput";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function EmailInput({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Email</label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(disabled ? styles.inputDisabled : {}),
        }}
        autoComplete="email"
      />
    </div>
  );
}
