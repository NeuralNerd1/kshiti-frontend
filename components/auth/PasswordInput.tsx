"use client";

import { passwordInputStyles as styles } from "@/styles/auth/passwordInput";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function PasswordInput({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Password</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(disabled ? styles.inputDisabled : {}),
        }}
        autoComplete="current-password"
      />
    </div>
  );
}
