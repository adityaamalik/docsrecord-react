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
    path: ["/updatepatient"],
    exact: true,
    component: "UpdatePatient",
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
  {
    path: ["/printbill"],
    exact: true,
    component: "PrintBill",
  },
  {
    path: ["/printprescription"],
    exact: true,
    component: "PrintPrescription",
  },
  {
    path: ["/logout"],
    exact: true,
    component: "Logout",
  },
];

export default routes;
