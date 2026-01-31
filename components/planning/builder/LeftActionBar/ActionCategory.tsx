"use client";

import {
  ActionCategory as CategoryType,
} from "../types";
import ActionItem from "./ActionItem";

type Props = {
  category: CategoryType;
  onAddStep: (actionKey: string) => void;
};

export default function ActionCategory({
  category,
  onAddStep,
}: Props) {
  return (
    <div className="builder-action-category">
      <div className="builder-category-title">
        {category.name}
      </div>

      {category.actions.map((action) => (
        <ActionItem
          key={action.action_key}
          action={action}
          onClick={() =>
            onAddStep(action.action_key)
          }
        />
      ))}
    </div>
  );
}
