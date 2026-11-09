import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/records", label: "Records", icon: "folder_shared" },
  { to: "/addpatient", label: "Add Patient", icon: "person_add" },
  { to: "/appointments", label: "Appointments", icon: "event" },
  { to: "/myprofile", label: "Profile", icon: "account_circle" },
  { to: "/statistics", label: "Statistics", icon: "bar_chart" },
];

// The public policy pages hide this header by looking up `.navbar-area`.
const Header = () => {
  const { pathname } = useLocation();

  return (
    <nav className="navbar-area glass-header" aria-label="Main">
      <Link className="glass-capsule glass-header__brand" to="/records">
        <img src="assets/images/logo.png" alt="Docsrecord" />
      </Link>

      <ul className="glass-capsule glass-header__links">
        {LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <Link
              to={to}
              className={`glass-header__link${
                pathname === to ? " is-active" : ""
              }`}
              aria-current={pathname === to ? "page" : undefined}
            >
              <i className="material-icons" aria-hidden="true">
                {icon}
              </i>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <a
        className="glass-capsule glass-header__logout"
        href="/"
        aria-label="Log out"
        title="Log out"
        onClick={() => {
          localStorage.clear();
        }}
      >
        <i className="material-icons" aria-hidden="true">
          logout
        </i>
      </a>
    </nav>
  );
};

export default Header;
