const routes = [
  {
    path: ["/", "/landing", "/login", "/signup"],
    exact: true,
    component: "Home",
  },
  {
    path: ["/records"],
    exact: true,
    component: "MaterialRecords",
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
];

export default routes;
