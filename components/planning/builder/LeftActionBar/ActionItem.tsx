"use client";

import { ActionDefinition } from "../types";

type Props = {
  action: ActionDefinition;
  onClick: () => void;
};

export default function ActionItem({
  action,
  onClick,
}: Props) {
  return (
    <div
      className="builder-action-item"
      onClick={onClick}
    >
      {action.action_name}
    </div>
  );
}
