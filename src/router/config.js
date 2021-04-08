const routes = [
  {
    path: ["/", "/landing", "/login"],
    exact: true,
    component: "Landing",
  },
  {
    path: ["/signup"],
    exact: true,
    component: "Signup",
  },
  {
    path: ["/records"],
    exact: true,
    component: "Records",
  },
  {
    path: ["/addpatient"],
    exact: true,
    component: "AddPatient",
  },
  {
    path: ["/myprofile"],
    exact: true,
    component: "MyProfile",
  },
  {
    path: ["/statistics"],
    exact: true,
    component: "Statistics",
  },
  {
    path: ["/appointments"],
    exact: true,
    component: "Appointments",
  },
];

export default routes;
