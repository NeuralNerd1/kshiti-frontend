"use client";

type Props = {
  value: string;
  onChange: (text: string) => void;
  readOnly?: boolean;
};

export default function HooksPanel({
  value,
  onChange,
  readOnly = false,
}: Props) {
  return (
    <div className="builder-hooks">
      <h3 className="builder-hooks-title">
        Manual check
      </h3>

      <textarea
        className="formTextarea"
        value={value}
        placeholder="Describe manual validation…"
        disabled={readOnly}
        onChange={(e) => {
          if (readOnly) return;
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
