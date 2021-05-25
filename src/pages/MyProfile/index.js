import * as S from "./styles";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
// import { useHistory } from "react-router-dom";
import { Grid, Snackbar } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

import Avatar from "@material-ui/core/Avatar";
import { Alert } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import EditIcon from "@material-ui/icons/Edit";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "95%",
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
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const MyProfile = () => {
  const classes = useStyles();
  const [docData, setDocData] = useState({});
  // const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMonthlyModalVisible, setIsMonthlyModalVisible] = useState(false);
  const [isYearlyModalVisible, setIsYearlyModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error] = useState(false);
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [visitCharges, setVisitCharges] = useState("");
  const [image, setImage] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");
    axios
      .get(`/doctors/${doctor}`)
      .then((response) => {
        console.log(response.data);
        setDocData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);

        setIsLoading(false);
      });
  }, []);

  const onSubmit = () => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");
    const data = new FormData();

    if (name !== "") {
      data.append("name", name);
    }

    if (clinicName !== "") {
      data.append("clinic_name", clinicName);
    }

    if (clinicAddress !== "") {
      data.append("clinic_address", clinicAddress);
      // data.clinic_address = clinicAddress;
    }

    if (phone !== "") {
      data.append("phone_number", phone);
      // data.phone_number = phone;
    }

    if (qualifications !== "") {
      data.append("qualifications", qualifications);
    }

    if (visitCharges !== "") {
      data.append("visit_charges", visitCharges);
      // data.visit_charges = visitCharges;
    }

    if (!!image) {
      data.append("image", image);
      console.log(image);
      // data.image.push(image);
    }
    axios
      .put(`/doctors/${doctor}`, data)
      .then((response) => {
        setSuccess(true);
        window.location.pathname = "/myprofile";
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
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
      key: "rzp_test_wWXoxoQf1kjrSm", // Enter the Key ID generated from the Dashboard
      amount: amount * 100,
      currency: currency,
      name: "DOCSRECORD",
      description: `DOCSRECORD ${subscription} subscription.`,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          doctorId: docData._id,
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          subscription: subscription,
        };

        const result = await axios.post("/payments/success", data);

        if (result) {
          // message
          //   .success("Payment successful !")
          //   .then(() => (window.location.pathname = "/myprofile"));
          window.location.pathname = "/myprofile";
        }
      },
      prefill: {
        name: docData.name,
        email: docData.email,
        contact: docData.phone_number,
      },
      notes: {
        address: docData.address,
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
          <CancelIcon
            style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setIsModalVisible(false)}
          />
        </div>

        <h1>Complete your payment</h1>
        <S.ModalDiv>
          <h3>
            Your plan is valid till :{" "}
            {moment(docData.payment_valid_till).format("MMMM Do YYYY")}
          </h3>
          <h3>Click on monthly or yearly button to check the details.</h3>
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
        <CancelIcon
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
        codeclan0100@gmail.com
      </p>
    </div>
  );
  const yearlybody = (
    <div style={modalStyle} className={classes.paper}>
      <div style={{ textAlign: "right" }}>
        <CancelIcon
          style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsYearlyModalVisible(false)}
        />
      </div>

      <h1>Yearly Plan</h1>
      <h3>Your subscription will be extended for 1 Year.</h3>
      <h3>Amount : ₹ 5000</h3>

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
        codeclan0100@gmail.com
      </p>
    </div>
  );
  return (
    <>
      {" "}
      <Snackbar
        open={success || error}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity={error ? "error" : "success"}
        >
          {error ? "Some error occured !" : "Patient Updated Successfully"}
        </Alert>
      </Snackbar>
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
      <S.Container>
        <S.Heading>MY PROFILE</S.Heading>

        <div style={{ textAlign: "center", marginTop: "50px" }}>
          {" "}
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                {!!docData.image ? (
                  <span>
                    <S.FileUploadLabel htmlFor="userImage">
                      <Avatar
                        src={`data:image/${
                          docData.image.contentType
                        };base64,${new Buffer.from(docData.image.data).toString(
                          "base64"
                        )}`}
                        className={classes.large}
                      />
                      <EditIcon />
                    </S.FileUploadLabel>
                    <S.FileUpload
                      type="file"
                      id="userImage"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <br />
                    <br />
                    <span>{image.name}</span>
                  </span>
                ) : (
                  <span></span>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                Your next payment date is :{" "}
                {moment(docData.payment_valid_till).format("MMMM Do YYYY")}
                <br />
                <button
                  onClick={() => setIsModalVisible(true)}
                  style={{
                    backgroundColor: "white",
                    border: "none",
                    borderBottom: "1px solid black",
                    cursor: "pointer",
                  }}
                >
                  Pay now
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ padding: 20 }}>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={6}>
              {!!docData.name && (
                <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <TextField
                    label="Edit name"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={docData.name}
                  />
                </form>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {docData.phone_number !== undefined &&
                docData.phone_number !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      variant="outlined"
                      label="Edit Phone Number"
                      onChange={(e) => setPhone(e.target.value)}
                      defaultValue={docData.phone_number}
                    />
                  </form>
                )}
            </Grid>

            <Grid item xs={12} sm={6}>
              {docData.clinic_name !== undefined &&
                docData.clinic_name !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      variant="outlined"
                      label="Edit clinic name"
                      defaultValue={docData.clinic_name}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </form>
                )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {docData.clinic_address !== undefined &&
                docData.clinic_address !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      variant="outlined"
                      label="Edit clinic's address"
                      defaultValue={docData.clinic_address}
                      onChange={(e) => setClinicAddress(e.target.value)}
                    />
                  </form>
                )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {docData.qualifications !== undefined &&
                docData.qualifications !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      variant="outlined"
                      label="Edit qualifications"
                      defaultValue={docData.qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                    />
                  </form>
                )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {docData.visit_charges !== undefined &&
                docData.visit_charges !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      variant="outlined"
                      label="Edit visit charges"
                      defaultValue={docData.visit_charges}
                      onChange={(e) => setVisitCharges(e.target.value)}
                    />
                  </form>
                )}
            </Grid>

            <Grid item>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={onSubmit}
              >
                Save Profile Changes
              </Button>
            </Grid>
          </Grid>

          {/* <S.FormRows align="middle">
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {!!docData.name && (
                <form className={classes.root} noValidate autoComplete="off">
                  <TextField
                    label="Edit name"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={docData.name}
                  />
                </form>
              )}
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.phone_number !== undefined &&
                docData.phone_number !== null && (
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      variant="outlined"
                      label="Edit Phone Number"
                      onChange={(e) => setPhone(e.target.value)}
                      defaultValue={docData.phone_number}
                    />
                  </form>
                )}
            </S.InputCols>
          </S.FormRows>

          <S.FormRows align="middle">
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.clinic_name !== undefined &&
                docData.clinic_name !== null && (
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      variant="outlined"
                      label="Edit clinic name"
                      defaultValue={docData.clinic_name}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </form>
                )}
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.clinic_address !== undefined &&
                docData.clinic_address !== null && (
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      variant="outlined"
                      label="Edit clinic's address"
                      defaultValue={docData.clinic_address}
                      onChange={(e) => setClinicAddress(e.target.value)}
                    />
                  </form>
                )}
            </S.InputCols>
          </S.FormRows>

          <S.FormRows align="middle">
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.qualifications !== undefined &&
                docData.qualifications !== null && (
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      variant="outlined"
                      label="Edit qualifications"
                      defaultValue={docData.qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                    />
                  </form>
                )}
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.visit_charges !== undefined &&
                docData.visit_charges !== null && (
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      variant="outlined"
                      label="Edit visit charges"
                      defaultValue={docData.visit_charges}
                      onChange={(e) => setVisitCharges(e.target.value)}
                    />
                  </form>
                )}
            </S.InputCols>
          </S.FormRows>

          <S.FormRows align="middle">
            <S.InputCols span={24} style={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={onSubmit}
              >
                Save Profile Changes
              </Button>
            </S.InputCols>
          </S.FormRows>

          <br />
          <br />
          <br /> */}
        </div>
      </S.Container>
    </>
  );
};

export default MyProfile;
