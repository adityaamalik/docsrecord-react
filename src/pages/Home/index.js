import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Modal, Grid } from "@material-ui/core";
import GoogleLogin from "react-google-login";
import axios from "axios";
import * as S from "./styles";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(2),
      width: "90%",
    },
  },
  paper: {
    position: "absolute",
    width: "auto",
    height: "auto",
    backgroundColor: theme.palette.background.paper,

    padding: theme.spacing(2, 4, 3),
    "@media (max-width: 767px)": {
      width: "75%",
      height: "75%",
    },
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Home = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  // to toggle login and register form
  const [registerForm, toggleRegisterForm] = useState(false);

  //states for register
  const [name, setName] = useState("");
  const [emailForRegister, setEmailForRegister] = useState("");
  const [passwordForRegister, setPasswordForRegister] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //states for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //state for disabling button while loading
  const [isLoading, setIsLoading] = useState(false);

  //modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMonthlyModalVisible, setIsMonthlyModalVisible] = useState(false);
  const [isYearlyModalVisible, setIsYearlyModalVisible] = useState(false);

  //storing doctor and token temporarily
  const [doctor, setDoctor] = useState({});
  const [token, setToken] = useState("");

  const onGoogleSuccess = (response) => {
    setName(response.profileObj.name);
    setEmailForRegister(response.profileObj.email);
  };

  const onGoogleFailure = (err) => {
    console.log(err);
  };

  const onSubmitForRegister = () => {
    if (!name) {
      alert("Name is required");
      setIsLoading(false);
    } else if (!emailForRegister) {
      alert("Email is required");
      setIsLoading(false);
    } else if (!passwordForRegister) {
      alert("Password is required");
      setIsLoading(false);
    } else if (passwordForRegister !== confirmPassword) {
      alert("Password does not match");
      setIsLoading(false);
    } else {
      setIsLoading(true);
      axios
        .post("/doctors/register", {
          name: name,
          email: emailForRegister,
          password: passwordForRegister,
        })
        .then((response) => {
          setIsLoading(false);

          localStorage.setItem("docsrecordDoctor", response.data.doctor._id);
          localStorage.setItem("token", response.data.token);

          window.location.pathname = "/records";
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response.data === "Email Already registered") {
            alert("This email is already registered !");
          }
        });
    }
  };

  const onSubmit = () => {
    setIsLoading(true);

    axios
      .post("/doctors/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setIsLoading(false);
        var today = new Date();
        var payment = new Date(response.data.doctor.payment_valid_till);
        setDoctor(response.data.doctor);
        if (today > payment) {
          setToken(response.data.token);
          setIsModalVisible(true);
        } else {
          localStorage.setItem("docsrecordDoctor", response.data.doctor._id);
          localStorage.setItem("token", response.data.token);

          window.location.pathname = "/records";
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        if (err.response.data === "email incorrect") {
          alert("This email is not registered !");
        } else if (err.response.data === "password incorrect") {
          alert("Password is wrong. Please try again !");
        } else {
          alert("Some error occured !");
        }
      });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (subscription) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await axios.post("/payments/orders", {
      subscription: subscription,
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_live_z0BocBawNlo2UK", // Enter the Key ID generated from the Dashboard
      amount: amount * 100,
      currency: currency,
      name: "DOCSRECORD",
      description: `DOCSRECORD ${subscription} subscription.`,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          doctorId: doctor._id,
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          subscription: subscription,
        };

        const result = await axios.post("/payments/success", data);

        if (result) {
          alert("Payment successful !");
          localStorage.setItem("token", token);
          localStorage.setItem("docsrecordDoctor", doctor._id);
          window.location.pathname = "/records";
        }
      },
      prefill: {
        name: doctor.name,
        email: doctor.email,
        contact: doctor.phone_number,
      },
      notes: {
        address: doctor.address,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div>
        <div style={{ textAlign: "right" }}>
          <i
            className="lni-cross-circle"
            style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setIsModalVisible(false)}
          />
        </div>

        <h1>Complete your payment</h1>
        <S.ModalDiv>
          <h3>
            Your plan expired on :{" "}
            {moment(doctor.payment_valid_till).format("MMMM Do YYYY")}
          </h3>
          <h3>
            Please buy a monthly or yearly plan to continue using DOCSRECORD.
          </h3>
        </S.ModalDiv>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={10} sm={6}>
            <Button
              variant="outlined"
              width="30"
              onClick={() => setIsMonthlyModalVisible(true)}
            >
              Monthly subscription
            </Button>
          </Grid>

          <Grid item xs={10} sm={6} alignItems="center">
            <Button
              variant="outlined"
              width="30"
              onClick={() => setIsYearlyModalVisible(true)}
            >
              Yearly subscription
            </Button>
          </Grid>
        </Grid>
        <br />
        <p>
          Contact Support for any queries : +91 - 8130083852 |
          codeclan0100@gmail.com
        </p>
      </div>
    </div>
  );

  const monthlybody = (
    <div style={modalStyle} className={classes.paper}>
      <div style={{ textAlign: "right" }}>
        <i
          className="lni-cross-circle"
          style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsMonthlyModalVisible(false)}
        />
      </div>

      <h1>Monthly Plan</h1>
      <h3>Your subscription will be extended for 1 Month.</h3>
      <h3>Amount : ₹ 500</h3>

      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={10} sm={6}>
          <Button
            variant="outlined"
            width="30"
            onClick={() => displayRazorpay("monthly")}
          >
            Continue to payment
          </Button>
        </Grid>
      </Grid>

      <br />
      <p>
        Contact Support for any queries : +91 - 8130083852 |
        docsrecordmail@gmail.com
      </p>
    </div>
  );
  const yearlybody = (
    <div style={modalStyle} className={classes.paper}>
      <div style={{ textAlign: "right" }}>
        <i
          className="lni-cross-circle"
          style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsYearlyModalVisible(false)}
        />
      </div>

      <h1>Yearly Plan</h1>
      <h3>Your subscription will be extended for 1 Year.</h3>
      <h3>Amount : ₹ 4999</h3>

      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={10} sm={6}>
          <Button
            variant="outlined"
            width="30"
            onClick={() => displayRazorpay("yearly")}
          >
            Continue to payment
          </Button>
        </Grid>
      </Grid>

      <br />
      <p>
        Contact Support for any queries : +91 - 8130083852 |
        docsrecordmail@gmail.com
      </p>
    </div>
  );

  return (
    <>
      {/* main modal */}
      <Modal open={isModalVisible} onClose={() => setIsModalVisible(false)}>
        {body}
      </Modal>
      <Modal
        open={isMonthlyModalVisible}
        onClose={() => setIsMonthlyModalVisible(false)}
      >
        {monthlybody}
      </Modal>
      <Modal
        open={isYearlyModalVisible}
        onClose={() => setIsYearlyModalVisible(false)}
      >
        {yearlybody}
      </Modal>

      <header className="header-area">
        <div className="navbar-area headroom">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg">
                  <a className="navbar-brand" href="/">
                    <img
                      src="assets/images/logo.png"
                      alt="Logo"
                      width="200px"
                    />
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
                      <li className="nav-item active">
                        <a href="/#home">HOME</a>
                      </li>
                      <li className="nav-item">
                        <a href="/#about">ABOUT</a>
                      </li>
                      <li className="nav-item">
                        <a href="/#services">FEATURES</a>
                      </li>
                      <li className="nav-item">
                        <a href="/#pricing">PRICING</a>
                      </li>
                      <li className="nav-item">
                        <a href="/#contact">CONTACT</a>
                      </li>
                    </ul>
                  </div>

                  <div className="navbar-btn d-none d-sm-inline-block">
                    <button
                      className="main-btn"
                      data-scroll-nav="0"
                      onClick={() => toggleRegisterForm(!registerForm)}
                    >
                      {registerForm ? "LOGIN" : "REGISTER"}
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div
          id="home"
          className="header-hero bg_cover d-lg-flex align-items-center"
          style={{ backgroundImage: `url(assets/images/header-hero.jpg)` }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="header-hero-content">
                  <h1 className="hero-title">
                    <b>DOCS</b>
                    <span>RECORD</span>
                  </h1>
                  <p className="text">MANAGE RECORDS. THE COOL WAY ! 😉</p>

                  {/* login form */}
                  {registerForm ? (
                    <div>
                      <h3 style={{ color: "#004aad" }}>
                        {name !== "" ? <>Hi, {name}</> : "REGISTER"}
                      </h3>
                      {emailForRegister !== "" ? (
                        <form
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                        >
                          <p>E-Mail : {emailForRegister}</p>
                          <TextField
                            type="password"
                            id="outlined-basic"
                            label="Set New Password"
                            variant="outlined"
                            value={passwordForRegister}
                            onChange={(e) =>
                              setPasswordForRegister(e.target.value)
                            }
                          />

                          <TextField
                            type="password"
                            id="outlined-basic"
                            label="Confirm New Password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={onSubmitForRegister}
                            disabled={isLoading}
                          >
                            {isLoading ? <CircularProgress /> : "Register"}
                          </Button>
                        </form>
                      ) : (
                        <>
                          <br />
                          <br />
                          <GoogleLogin
                            clientId="824922868367-uf280onns6u425nfh4d6krq7bu4suu1g.apps.googleusercontent.com"
                            buttonText="Get started with google"
                            onSuccess={onGoogleSuccess}
                            onFailure={onGoogleFailure}
                            cookiePolicy={"single_host_origin"}
                          />
                          <br />
                          <br />
                          <Button onClick={() => toggleRegisterForm(false)}>
                            Already registered ? Login
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <form
                        className={classes.root}
                        noValidate
                        autoComplete="off"
                      >
                        <h3 style={{ color: "#004aad" }}>Login</h3>

                        <TextField
                          type="email"
                          id="outlined-basic"
                          label="E-mail"
                          variant="outlined"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                          type="password"
                          id="outlined-basic"
                          label="Password"
                          variant="outlined"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={onSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? <CircularProgress /> : "Login"}
                        </Button>

                        <Button onClick={() => toggleRegisterForm(true)}>
                          or Register
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="header-hero-image d-flex align-items-center">
            <div className="image">
              <img src="assets/images/hero-image.png" alt="Hero" />
            </div>
          </div>
        </div>
      </header>

      <section id="about" className="about-area pt-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="about-title text-center">
                <h6 className="welcome">WELCOME</h6>
                <h3 className="title">
                  <span>DOCSRECORD</span> is an easier, affordable, convenient
                  and fun way to store your patient records.
                </h3>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="about-image mt-60">
                <video
                  src="assets/images/charts.mp4"
                  loop
                  autoPlay
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="about-content">
                <div className="about-counter pt-60">
                  <div className="row">
                    <div className="col-sm-4">
                      <div className="single-counter counter-color-1 mt-30 d-flex">
                        <div className="counter-shape">
                          <span className="shape-1"></span>
                          <span className="shape-2"></span>
                        </div>
                        <div className="counter-content media-body">
                          <span className="counter-count">
                            <span className="counter">10</span>
                          </span>
                          <p className="text">DOCTORS</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="single-counter counter-color-2 mt-30 d-flex">
                        <div className="counter-shape">
                          <span className="shape-1"></span>
                          <span className="shape-2"></span>
                        </div>
                        <div className="counter-content media-body">
                          <span className="counter-count">
                            <span className="counter">99</span>%
                          </span>
                          <p className="text">Satisfaction</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="single-counter counter-color-3 mt-30 d-flex ">
                        <div className="counter-shape">
                          <span className="shape-1"></span>
                          <span className="shape-2"></span>
                        </div>
                        <div className="counter-content media-body">
                          <span className="counter-count">
                            <span className="counter">150 +</span>
                          </span>
                          <p className="text">PATIENTS ADDED</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="our-services-area pt-115">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-9">
              <div className="section-title text-center ">
                <h6 className="sub-title">FEATURES</h6>
                <h4 className="title">
                  Lots of features <span>to fulfill your needs.</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="our-services-tab pt-30">
                <ul
                  className="nav justify-content-center "
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="active"
                      id="business-tab"
                      data-toggle="tab"
                      href="#business"
                      role="tab"
                      aria-controls="business"
                      aria-selected="true"
                    >
                      <i className="lni-briefcase"></i>{" "}
                      <span>Manage Records</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      id="digital-tab"
                      data-toggle="tab"
                      href="#digital"
                      role="tab"
                      aria-controls="digital"
                      aria-selected="false"
                    >
                      <i className="lni-bullhorn"></i>{" "}
                      <span>Set Appointments</span>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      id="market-tab"
                      data-toggle="tab"
                      href="#market"
                      role="tab"
                      aria-controls="market"
                      aria-selected="false"
                    >
                      <i className="lni-stats-up"></i>{" "}
                      <span>View Statistics</span>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      id="notify-tab"
                      data-toggle="tab"
                      href="#notify"
                      role="tab"
                      aria-controls="market"
                      aria-selected="false"
                    >
                      <i className="lni-plane"></i> <span>Notify Patients</span>
                    </a>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="business"
                    role="tabpanel"
                    aria-labelledby="business-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="assets/images/records.png"
                            alt="patient records"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">
                            Manage patient records
                          </h3>
                          <p className="text">
                            Docsrecord gives you a very friendly interface for
                            storing your patient records. You can manage your
                            patients easily through docsrecord. You can find a
                            record by our patient search tool.
                            <br />
                            <br />
                            Our product can be accessed through any device and
                            you can easily see all your records.
                            <br />
                            <br />
                            By DOCSRECORD, we want to break the conventional way
                            of storing patient records. You can keep your
                            patient records for many years through our product.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="digital"
                    role="tabpanel"
                    aria-labelledby="digital-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="assets/images/appointments.png"
                            alt="set appointments"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">Set appointments</h3>
                          <p className="text">
                            We provide a feature for doctors to set next
                            appointment for an added patient in their records.
                            Doctors can go to appointments page and view their
                            upcoming appointments at a glance.
                            <br />
                            <br />
                            Patients will also be notified by E-Mail when the
                            doctor sets the next appointment for the patient.
                            <br />
                            <br />
                            We make the appointment management easy for doctors.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="market"
                    role="tabpanel"
                    aria-labelledby="market-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="assets/images/stats.png"
                            alt="view statistics"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">View Statistics</h3>
                          <p className="text">
                            Doctors can view the statistics of their patient
                            records through our product.
                            <br />
                            <br />
                            We believe that reading and studying statistics of
                            your patients can be directly proportional to your
                            growth. We provide an efficent way of viewing the
                            statistics of your patient records.
                            <br />
                            <br />
                            We provide Monthly and Weekly analysis of your data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="notify"
                    role="tabpanel"
                    aria-labelledby="notify-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="our-services-image mt-50">
                          <img
                            src="assets/images/notification.png"
                            alt="service"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="our-services-content mt-45">
                          <h3 className="services-title">Notify Patients</h3>
                          <p className="text">
                            Patients often tend to forget about their
                            appointments with the doctor or they are late for
                            them. Docsrecord sends an automatic notification to
                            the patient via E-Mail for their next appointment.
                            <br />
                            <br />
                            <ol>
                              <li>1. Doctor stores a record</li>
                              <li>2. Sets the next appointment</li>
                              <li>
                                3. Appointment is added and can be viewed on
                                appointments page
                              </li>
                              <li>
                                <strong>4. Patient notified via E-mail</strong>
                              </li>
                            </ol>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="service" className="service-area pt-105">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-8">
              <div className="section-title">
                <h6 className="sub-title">Why Us</h6>
                <h4 className="title">The reasons to choose us.</h4>
              </div>
            </div>
          </div>
          <div className="service-wrapper mt-60">
            <div className="row no-gutters justify-content-center">
              <div className="col-lg-4 col-md-7">
                <div className="single-service d-flex">
                  <div className="service-icon">
                    <img src="assets/images/service-1.png" alt="Icon" />
                  </div>
                  <div className="service-content media-body">
                    <h4 className="service-title">Affordable Pricing</h4>
                    <p className="text">
                      Our product and services are cheaper than any other
                      competitor out in the market.
                    </p>
                  </div>
                  <div className="shape shape-1">
                    <img src="assets/images/shape/shape-1.svg" alt="shape" />
                  </div>
                  <div className="shape shape-2">
                    <img src="assets/images/shape/shape-2.svg" alt="shape" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="single-service service-border d-flex">
                  <div className="service-icon">
                    <img src="assets/images/service-2.png" alt="Icon" />
                  </div>
                  <div className="service-content media-body">
                    <h4 className="service-title">Safe and Secure</h4>
                    <p className="text">
                      Your data is secure with us. We ensure that you never lose
                      your data by keeping multiple copies of your data.
                    </p>
                  </div>
                  <div className="shape shape-3">
                    <img src="assets/images/shape/shape-3.svg" alt="shape" />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="single-service d-flex">
                  <div className="service-icon">
                    <img src="assets/images/service-3.png" alt="Icon" />
                  </div>
                  <div className="service-content media-body">
                    <h4 className="service-title">Contact Support</h4>
                    <p className="text">
                      We are here for any queries 24 * 7. We make sure that you
                      never face any problem managing your patient records.
                    </p>
                  </div>
                  <div className="shape shape-4">
                    <img src="assets/images/shape/shape-4.svg" alt="shape" />
                  </div>
                  <div className="shape shape-5">
                    <img src="assets/images/shape/shape-5.svg" alt="shape" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-scroll-index="0"
        id="pricing"
        className="pricing-area pt-115"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8 col-sm-9">
              <div className="section-title text-center pb-20 ">
                <h6 className="sub-title">Pricing Plans</h6>
                <h4 className="title">
                  PROVIDING BEST PRICING <span>FOR YOUR CLINIC.</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="col-lg-4 col-md-7 col-sm-9">
              <div className="single-pricing text-center pricing-color-1 mt-30">
                <div className="pricing-price">
                  <span className="price">
                    <span className="symbol">₹</span> <b>499</b>
                  </span>
                </div>
                <div className="pricing-title mt-20">
                  <span className="btn">20% Off</span>
                  <h4 className="title">MONTHLY</h4>
                </div>
                <div className="pricing-list pt-20">
                  <ul>
                    <li>FULL ACCESS</li>
                    <li>ALL FEATURES AVAILABLE</li>
                    <li>24 * 7 SUPPORT</li>
                  </ul>
                </div>
                <div className="pricing-btn pt-70">
                  <a className="main-btn main-btn-2" href="/#">
                    GET STARTED FOR FREE
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-7 col-sm-9">
              <div className="single-pricing text-center pricing-active pricing-color-2 mt-30">
                <div className="pricing-price">
                  <span className="price">
                    <b>FREE</b>
                  </span>
                </div>
                <div className="pricing-title mt-20">
                  <span className="btn">30 DAYS FREE TRIAL</span>
                </div>
                <div className="pricing-list pt-20">
                  <ul>
                    <li>FULL ACCESS</li>
                    <li>ALL FEATURES AVAILABLE</li>
                    <li>24 * 7 SUPPORT</li>
                  </ul>
                </div>
                <div className="pricing-btn pt-70">
                  <a className="main-btn" href="/#">
                    GET STARTED FOR FREE
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-7 col-sm-9">
              <div className="single-pricing text-center pricing-color-3 mt-30">
                <div className="pricing-price">
                  <span className="price">
                    <span className="symbol">₹</span> <b>4999</b>
                  </span>
                </div>
                <div className="pricing-title mt-20">
                  <span className="btn">20% Off</span>
                  <h4 className="title">YEARLY</h4>
                </div>
                <div className="pricing-list pt-20">
                  <ul>
                    <li>FULL ACCESS</li>
                    <li>ALL FEATURES AVAILABLE</li>
                    <li>24 * 7 SUPPORT</li>
                  </ul>
                </div>
                <div className="pricing-btn pt-70">
                  <a className="main-btn main-btn-2" href="/#">
                    GET STARTED FOR FREE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-area pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div className="section-title text-center pb-20">
                <h6 className="sub-title">Our Contact</h6>
                <h4 className="title">
                  Get In <span>Touch.</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="contact-info pt-30">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="single-contact-info contact-color-1 mt-30 d-flex ">
                  <div className="contact-info-icon">
                    <i className="lni-map-marker"></i>
                  </div>
                  <div className="contact-info-content media-body">
                    <p className="text">ADDRESS</p>
                    <p className="text">
                      197, 2nd F, sector-12, Vasundhara, Ghaziabad
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-contact-info contact-color-2 mt-30 d-flex">
                  <div className="contact-info-icon">
                    <i className="lni-envelope"></i>
                  </div>
                  <div className="contact-info-content media-body">
                    <p className="text">E-MAIL</p>
                    <p className="text">docsrecordmail@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-contact-info contact-color-3 mt-30 d-flex">
                  <div className="contact-info-icon">
                    <i className="lni-phone"></i>
                  </div>
                  <div className="contact-info-content media-body">
                    <p className="text">PHONE</p>
                    <p className="text">+91 - 8130083852</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        className="footer-area bg_cover"
        // style="background-image: url(assets/images/footer-bg.jpg)"
      >
        <div className="container">
          <div className="footer-widget pt-30 pb-70">
            <div className="row">
              <div className="col-lg-3 col-sm-6 order-sm-1 order-lg-1">
                <div className="footer-about pt-40">
                  <a href="/#">
                    <img src="assets/images/logo.png" alt="Logo" />
                  </a>
                  <p className="text">
                    DOCSRECORD is an easy, affordable, convenient and fun way of
                    storing your pateint records.
                  </p>{" "}
                  <p className="text">
                    Get started for free now. Try out our platform for 30 days.
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 order-sm-3 order-lg-2">
                <div className="footer-link pt-40">
                  <div className="footer-title">
                    <h5 className="title">Services</h5>
                  </div>
                  <ul>
                    <li>MANAGE PATIENT RECORDS</li>
                    <li>SET APPOINTMENTS</li>
                    <li>VIEW STATISTICS</li>
                    <li>NOTIFY PATIENTS FOR THEIR APPOINTMENTS</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 order-sm-4 order-lg-3">
                <div className="footer-link pt-40">
                  <div className="footer-title">
                    <h5 className="title">POLICIES</h5>
                  </div>
                  <ul>
                    <li>
                      <a href="/privacypolicy">Privacy policy</a>
                    </li>
                    <li>
                      <a href="refundpolicy">Refund Policy</a>
                    </li>
                    <li>
                      <a href="termsofservice">Terms Of Service</a>
                    </li>
                    <li>
                      <a href="/aboutus">About Us</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 order-sm-2 order-lg-4">
                <div className="footer-contact pt-40">
                  <div className="footer-title">
                    <h5 className="title">Contact Info</h5>
                  </div>
                  <div className="contact pt-10">
                    <p className="text">
                      197, 2nd F, sector-12, Vasundhara, Ghaziabad
                    </p>
                    <p className="text">docsrecordmail@gmail.com</p>
                    <p className="text">+91 - 8130083852</p>

                    <ul className="social mt-40">
                      <li>
                        <a href="https://www.instagram.com/docsrecord/">
                          <i className="lni-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/docsrecord/">
                          <i className="lni-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/docsrecord/">
                          <i className="lni-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/docsrecord/">
                          <i className="lni-linkedin"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright text-center">
            <p className="text">© 2021 DOCSRECORD. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <a href="/#" className="back-to-top">
        <i className="lni-chevron-up"></i>
      </a>
    </>
  );
};

export default Home;
