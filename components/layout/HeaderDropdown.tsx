type HeaderDropdownProps = {
  onClose: () => void;
};

export default function HeaderDropdown({
  onClose,
}: HeaderDropdownProps) {
  return (
    <div className="header-dropdown">
      <div className="header-dropdown__identity">
        <div className="header-dropdown__name">
          User Name
        </div>
        <div className="header-dropdown__email">
          user@company.com
        </div>
      </div>

      <div className="header-dropdown__section">
        <div className="header-dropdown__item">
          Admin Console
        </div>
        <div className="header-dropdown__item header-dropdown__item--disabled">
          Projects Console (Coming soon)
        </div>
        <div className="header-dropdown__item">
          Profile
        </div>
      </div>

      <div className="header-dropdown__divider" />

      <div className="header-dropdown__item header-dropdown__item--danger">
        Logout
      </div>
    </div>
  );
}
