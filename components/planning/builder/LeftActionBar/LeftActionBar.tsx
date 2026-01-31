import { ActionCategory } from "../types";

type Props = {
  categories: ActionCategory[];
  onAddStep: (actionKey: string) => void;
};

export default function LeftActionBar({
  categories,
  onAddStep,
}: Props) {
  if (!categories || categories.length === 0) {
    return (
      <div className="builder-left">
        <div className="builder-actions-panel">
          <div className="text-xs text-gray-500 px-2">
            No actions available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-left">

      {/* ===============================
          HELPER TEXT (TOP)
      =============================== */}
      <div className="builder-left-helper-top">
        <p>Click an action to add it to the flow</p>
        <p>
          Press <kbd>Shift</kbd> + <kbd>A</kbd> for quick add
        </p>
      </div>

      {/* ===============================
          ACTION LIST (SCROLL)
      =============================== */}
      <div className="builder-left-scroll">
        <div className="builder-actions-panel">
          {categories.map((category) => (
            <div
              key={category.name}
              className="builder-action-category"
            >
              <div className="builder-category-title">
                {category.name}
              </div>

              {category.actions?.map((action) => (
                <div
                  key={action.action_key}
                  className="builder-action-item"
                  onClick={() =>
                    onAddStep(action.action_key)
                  }
                >
                  {action.action_name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
