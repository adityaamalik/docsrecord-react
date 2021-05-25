import { useState, useEffect } from "react";
import * as S from "./styles";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
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
}));

const UpdatePatient = (props) => {
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [treatments, setTreatments] = useState([]);

  const [currTreatment, setCurrTreatment] = useState("");
  const [currCharges, setCurrCharges] = useState("");

  const { id } = props.location.state;

  useEffect(() => {
    setIsLoading(true);
    if (!!id) {
      axios
        .get(`/patients/${id}`)
        .then((response) => {
          setPatient(response.data);
          console.log(response.data);
          let t = [];
          if (response.data.treatments) {
            response.data.treatments.forEach(function (obj) {
              const temp = {
                treatment: obj.treatment,
                charges: obj.charges,
                id: t.length,
              };
              t.push(temp);
            });
            setTreatments(t);

            console.log(response.data.treatments);
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
          setIsLoading(false);
        });
    } else {
      history.push("/records");
    }
  }, [id, history]);

  const onFinish = () => {
    setIsLoading(true);
    console.log(treatments);
    let t = [];

    treatments.forEach((temp) => {
      const a = {
        treatment: temp.treatment,
        charges: temp.charges,
      };
      console.log(a);
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

    data.treatments = t;

    axios
      .put(`/patients/${id}`, data)
      .then((response) => {
        console.log(response);
        setPatient(response.data);
        setSuccess(true);
        setTimeout(() => {
          history.push("/records");
        }, 2000);
      })
      .catch((err) => {
        setError(true);
        setIsLoading(false);
        console.log(err);
      });
  };
  let login = (
    <Button color="primary" variant="outlined" onClick={onFinish}>
      Update Patient Record
    </Button>
  );
  if (isLoading === true) {
    login = <CircularProgress />;
  }

  return (
    <>
      <S.Container>
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
        <S.Heading>UPDATE PATIENT</S.Heading>

        <div className="classes.root">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={4} md={4} sm={12} xs={12}>
              {patient.name !== undefined && patient.name !== null && (
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
                    defaultValue={patient.name}
                  />
                </form>
              )}
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              {patient.age !== undefined && patient.age !== null && (
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
                    defaultValue={patient.age}
                  />
                </form>
              )}
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              {patient.gender !== undefined && patient.gender !== null && (
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
                    defaultValue={patient.gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Age"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              )}
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
              {patient.phone_number !== undefined &&
                patient.phone_number !== null && (
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
                      defaultValue={patient.phone_number}
                    />
                  </form>
                )}
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              {patient.email !== undefined && patient.email !== null && (
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
                    defaultValue={patient.email}
                  />
                </form>
              )}
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
              {patient.address !== undefined && patient.address !== null && (
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
                    defaultValue={patient.address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                  />
                </form>
              )}
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
              {patient.payment_method !== undefined &&
                patient.payment_method !== null && (
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
                      defaultValue={patient.payment_method}
                    />
                  </form>
                )}
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

export default UpdatePatient;
