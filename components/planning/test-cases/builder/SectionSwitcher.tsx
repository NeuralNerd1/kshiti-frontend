"use client";

import clsx from "clsx";

type Section =
  | "pre_conditions"
  | "steps"
  | "expected_outcomes";

type Props = {
  active: Section;
  dirty: Record<Section, boolean>;
  onChange: (section: Section) => void;
};

const SECTIONS: {
  key: Section;
  label: string;
}[] = [
  {
    key: "pre_conditions",
    label: "Pre-Conditions",
  },
  {
    key: "steps",
    label: "Steps",
  },
  {
    key: "expected_outcomes",
    label: "Expected Outcomes",
  },
];

export default function SectionSwitcher({
  active,
  dirty,
  onChange,
}: Props) {
  return (
    <div className="builder-section-switcher">
      {SECTIONS.map((section) => {
        const isActive =
          active === section.key;

        const isDirty =
          dirty?.[section.key];

        return (
          <button
            key={section.key}
            onClick={() =>
              onChange(section.key)
            }
            className={clsx(
              "builder-section-tab",
              isActive && "active",
              isDirty && "dirty"
            )}
          >
            {section.label}
          </button>
        );
      })}
    </div>
  );
}
