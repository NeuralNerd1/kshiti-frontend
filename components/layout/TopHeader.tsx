import HeaderUserCard from "./HeaderUserCard";

export default function TopHeader() {
  return (
    <div className="top-header">
      <div className="top-header__left">
        <div className="top-header__company">
          Company Name
        </div>
      </div>

      <div className="top-header__right">
        <HeaderUserCard />
      </div>
    </div>
  );
}
