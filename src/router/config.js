const routes = [
  {
    path: ["/", "/landing", "/login", "/signup"],
    exact: true,
    component: "Home",
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
    path: ["/termsofservice"],
    exact: true,
    component: "TermsOfService",
  },
  {
    path: ["/privacypolicy"],
    exact: true,
    component: "PrivacyPolicy",
  },
  {
    path: ["/refundpolicy"],
    exact: true,
    component: "RefundPolicy",
  },
  {
    path: ["/aboutus"],
    exact: true,
    component: "AboutUs",
  },
];

export default routes;
