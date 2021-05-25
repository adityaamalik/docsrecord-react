const Header = () => {
  return (
    <div className="navbar-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <nav className="navbar navbar-expand-lg">
              <a className="navbar-brand" href="/records">
                <img src="assets/images/logo.png" alt="Logo" width="200px" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="toggler-icon"></span>
                <span className="toggler-icon"></span>
                <span className="toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse sub-menu-bar"
                id="navbarSupportedContent"
              >
                <ul id="nav" className="navbar-nav m-auto">
                  <li className="nav-item">
                    <a href="/records">RECORDS</a>
                  </li>
                  <li className="nav-item">
                    <a href="/addpatient">ADD PATIENT</a>
                  </li>
                  <li className="nav-item">
                    <a href="/appointments">APPOINTMENTS</a>
                  </li>
                  <li className="nav-item">
                    <a href="/myprofile">MY PROFILE</a>
                  </li>
                  <li className="nav-item">
                    <a href="/statistics">STATISTICS</a>
                  </li>
                  <li className="nav-item">
                    <a
                      onClick={() => {
                        localStorage.clear();
                      }}
                      href="/"
                    >
                      LOGOUT
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
