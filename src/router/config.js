const routes = [
  {
    path: ["/", "/landing"],
    exact: true,
    component: "Landing",
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
];

export default routes;
