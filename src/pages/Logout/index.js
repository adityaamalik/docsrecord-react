import axios from "axios";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    axios.get("https://docsrecord-backend.herokuapp.com/doctors/logout", {
      withCredentials: true,
    });
    window.location.pathname = "/";
  }, []);

  return <h1>Logged out</h1>;
};

export default Logout;
