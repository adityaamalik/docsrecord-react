import { message, Spin } from "antd";
import * as S from "./styles";
import { useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

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
}));

const AddPatient = () => {
  const classes = useStyles();
  const history = useHistory();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [treatments, setTreatments] = useState([]);
  const [charges, setCharges] = useState([]);

  const [numberOfTreatments, setNumberOfTreatments] = useState([]);

  const [islogin, setIslogin] = useState(false);
  const onFinish = () => {
    setIslogin(true);
    // console.log("Received values of form:", values);

    const doctor = localStorage.getItem("docsrecordDoctor");

    const data = new FormData();
    data.append("doctor", doctor);
    if (!name) {
    }
    if (name !== "") {
      data.append("name", name);
    }

    if (age !== "") {
      data.append("age", age);
    }

    if (gender !== "") {
      data.append("clinic_address", gender);
      // data.clinic_address = clinicAddress;
    }

    if (phone !== "") {
      data.append("phone_number", phone);
      // data.phone_number = phone;
    }

    if (email !== "") {
      data.append("email", email);
    }

    if (address !== "") {
      data.append("address", address);
      // data.visit_charges = visitCharges;
    }
    if (paymentMethod !== "") {
      data.append("paymnent_method", paymentMethod);
      // data.visit_charges = visitCharges;
    }
    if (charges !== "") {
      data.append("total_cost", charges);
      // data.visit_charges = visitCharges;
    }
    if (numberOfTreatments !== "") {
      data.append("total_treatments", numberOfTreatments);
      // data.visit_charges = visitCharges;
    }
    if (treatments) data.append("treatments", treatments);
    console.log(treatments);
    console.log(charges);
    console.log(numberOfTreatments);

    axios
      .post("/patients", data)
      .then((response) => {
        setIslogin(false);
        console.log(response);
        message.success("Patient added successfully !", 1).then(() => {
          history.push("/records");
        });
      })
      .catch((err) => {
        setIslogin(false);
        console.log(err);
      });
  };

  let login = (
    <Button variant="outlined" onClick={onFinish}>
      Add Patient Record
    </Button>
  );
  if (islogin === true) {
    login = <CircularProgress />;
  }

  return (
    <>
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
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
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
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </form>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  label="Email"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
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
            <Grid item xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  id="outlined-multiline-static"
                  label="Address"
                  multiline
                  rows={4}
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
              {numberOfTreatments.map((id, index) => (
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={3}
                  key={index}
                >
                  <Grid item xs={5}>
                    <form
                      className={classes.root}
                      noValidate
                      autoComplete="off"
                      onSubmit={(event) => event.preventDefault()}
                    >
                      <TextField
                        label="Treatment"
                        variant="outlined"
                        onChange={(e) => {
                          const temp = treatments;
                          temp[
                            numberOfTreatments[numberOfTreatments.length - 1]
                          ] = e.target.value;

                          setTreatments(temp);
                        }}
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
                        label="Charges"
                        variant="outlined"
                        onChange={(e) => {
                          const temp = charges;
                          temp[
                            numberOfTreatments[numberOfTreatments.length - 1]
                          ] = e.target.value;

                          setCharges(temp);
                        }}
                      />
                    </form>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      onClick={() => {
                        setNumberOfTreatments(
                          numberOfTreatments.filter((t) => {
                            return t !== id;
                          })
                        );
                      }}
                    >
                      -
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                onClick={() => {
                  setNumberOfTreatments([
                    ...numberOfTreatments,
                    numberOfTreatments.length,
                  ]);
                }}
                variant="outlined"
              >
                + Add Treatment
              </Button>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <form
                className={classes.root}
                noValidate
                autoComplete="off"
                onSubmit={(event) => event.preventDefault()}
              >
                <TextField
                  label="Payment Method"
                  variant="outlined"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                />
              </form>
            </Grid>
          </Grid>

          <div style={{ textAlign: "center" }}>{login}</div>
        </div>
      </S.Container>
    </>
  );
};

export default AddPatient;
