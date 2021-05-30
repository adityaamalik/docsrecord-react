import * as S from "./styles";
import { useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  Paper,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Grid,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paperClass: {
    margin: theme.spacing(1),
    width: "100%",
  },
}));

const AddPatient = () => {
  const classes = useStyles();
  const history = useHistory();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const [treatments, setTreatments] = useState([]);

  const [currTreatment, setCurrTreatment] = useState("");
  const [currCharges, setCurrCharges] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onFinish = () => {
    setIsLoading(true);
    let t = [];
    treatments.forEach((temp) => {
      const a = {
        treatment: temp.treatment,
        charges: temp.charges,
      };
      t.push(a);
    });

    const doctor = localStorage.getItem("docsrecordDoctor");

    let data = {};
    data["doctor"] = doctor;

    if (name !== "") {
      data.name = name;
    }

    if (age !== "") {
      data.age = age;
    }

    if (gender !== "") {
      data.gender = gender;
    }

    if (phone !== "") {
      data.phone_number = phone;
    }

    if (email !== "") {
      data.email = email;
    }

    if (address !== "") {
      data.address = address;
    }
    if (paymentMethod !== "") {
      data.payment_method = paymentMethod;
    }

    data.date_of_birth = dateOfBirth;

    if (t.length !== 0) {
      data.treatments = t;
    }

    axios
      .post("/patients", data)
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        setSuccess(true);
        setTimeout(() => {
          history.push("/records");
        }, 2000);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(true);
        console.log(err);
      });
  };

  let login = (
    <Button color="primary" variant="outlined" onClick={onFinish}>
      Add Patient Record
    </Button>
  );
  if (isLoading === true) {
    login = <CircularProgress />;
  }

  return (
    <>
      <Snackbar
        open={success || error}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity={error ? "error" : "success"}
        >
          {error ? "Some error occured !" : "Patient Added Successfully"}
        </Alert>
      </Snackbar>
      <S.Container>
        <S.Heading>ADD PATIENT</S.Heading>

        <div className="classes.root">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  type="text"
                  label="Name"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </form>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  type="number"
                  label="Age"
                  variant="outlined"
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                />
              </form>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                onSubmit={(event) => event.preventDefault()}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Gender
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  label="Age"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  type="number"
                  label="Phone Number"
                  variant="outlined"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </form>
            </Grid>

            <Grid item lg={4} md={4} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </form>
            </Grid>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <KeyboardDatePicker
                  style={{ width: "100%" }}
                  clearable
                  value={dateOfBirth}
                  label="Date Of Birth"
                  onChange={(date) => setDateOfBirth(date)}
                  format="MM/dd/yyyy"
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  variant="outlined"
                />
              </form>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  type="text"
                  label="Payment Method"
                  variant="outlined"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                />
              </form>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <Grid item xs={5}>
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      type="text"
                      label="Add Treatment"
                      variant="outlined"
                      onChange={(e) => setCurrTreatment(e.target.value)}
                      value={currTreatment}
                    />
                  </form>
                </Grid>
                <Grid item xs={5}>
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      type="number"
                      label="Add Charges"
                      variant="outlined"
                      onChange={(e) => setCurrCharges(e.target.value)}
                      value={currCharges}
                    />
                  </form>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (currTreatment !== "") {
                        const temp = {
                          treatment: currTreatment,
                          charges: currCharges,
                          id: treatments.length,
                        };

                        const tempTreatments = treatments;
                        tempTreatments.unshift(temp);

                        setTreatments(tempTreatments);
                        setCurrTreatment("");
                        setCurrCharges("");
                      }
                    }}
                  >
                    <i
                      className="lni-plus"
                      style={{ fontWeight: "bolder", color: "#004aad" }}
                    ></i>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {treatments.map((treatment, index) => {
            return (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
                key={index}
              >
                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item xs={5}>
                      <Paper
                        className={classes.paperClass}
                        elevation={2}
                        children={
                          <div style={{ padding: "5px", textAlign: "center" }}>
                            <strong>{treatment.treatment}</strong>
                          </div>
                        }
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Paper
                        className={classes.paperClass}
                        elevation={2}
                        children={
                          <div style={{ padding: "5px", textAlign: "center" }}>
                            <strong>{treatment.charges}</strong>
                          </div>
                        }
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setTreatments(
                            treatments.filter((t) => t.id !== treatment.id)
                          )
                        }
                      >
                        <i
                          className="lni-minus"
                          style={{ fontWeight: "bolder", color: "red" }}
                        ></i>
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}

          <div
            style={{
              textAlign: "center",
              marginTop: "50px",
            }}
          >
            {login}
          </div>
        </div>
      </S.Container>
      <br />
    </>
  );
};

export default AddPatient;
