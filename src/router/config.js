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
];

export default routes;
