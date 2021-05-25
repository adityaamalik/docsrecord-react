import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  CircularProgress,
  Grid,
  Button,
  Snackbar,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "80vh",
  },
  paper: {
    position: "absolute",
    width: "90%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "scroll",
    height: "90%",
  },
}));

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const Records = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [modalStyle] = useState(getModalStyle);
  const [records, setRecords] = useState([]);
  const [isLoading, toggleIsLoading] = useState(false);

  const [modalContentLoading, setModalContentLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [patient, setPatient] = useState({});

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [selectedTimeString, setSelectedTimeString] = useState("12:00 PM");

  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentError, setAppointmentError] = useState(false);

  const [imageSuccess, setImageSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    toggleIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");

    axios
      .get(`/patients?doctor=${doctor}`)
      .then((response) => {
        setRecords(response.data);
        toggleIsLoading(false);
      })
      .catch((err) => {
        toggleIsLoading(false);
        if (!!err.response && err.response.status === 401) {
          setAuthError(true);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 1000);
        }
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleModalOpen = (id) => {
    setModalOpen(true);
    setModalContentLoading(true);

    axios
      .get(`/patients/${id}`)
      .then((response) => {
        console.log(response.data);
        setPatient(response.data);
        setImages(response.data.images);
        setModalContentLoading(false);
      })
      .catch((err) => {
        setModalContentLoading(false);
        if (!!err.response && err.response.status === 401) {
          setAuthError(true);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 1000);
        }
      });
  };

  const deleteRecord = (id) => {
    axios
      .delete(`/patients/${id}`)
      .then((response) => {
        setModalOpen(false);
        setDeleteSuccess(true);
        const newData = records.filter((item) => {
          return item._id !== id;
        });

        setRecords(newData);
      })
      .catch((err) => {
        console.log(err.response);
        setDeleteError(true);
      });
  };

  const setNextAppointment = (id) => {
    axios
      .put(`/patients/${id}`, {
        next_appointment_date: selectedDate,
        next_appointment_time: selectedTimeString,
      })
      .then((response) => {
        setAppointmentSuccess(true);
      })
      .catch((err) => {
        console.log(err.response);
        setAppointmentError(true);
      });
  };

  const onUploadPhotos = (id) => {
    setModalContentLoading(true);
    const formData = new FormData();

    for (let image of selectedImages) {
      formData.append("images", image);
    }

    axios
      .put(`/patients/${id}`, formData)
      .then((response) => {
        const temp = records.filter((d) => {
          return d._id !== response.data._id;
        });
        temp.unshift(response.data);
        setRecords(temp);
        setSelectedImages([]);
        setImages(response.data.images);
        document.getElementById("images").value = null;
        setModalContentLoading(false);
        setImageSuccess(true);
      })
      .catch((err) => {
        setModalContentLoading(false);
        setImageError(true);
      });
    setModalContentLoading(false);
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    {
      id: "phone_number",
      label: "Phone Number",
      minWidth: 100,
      align: "center",
    },
    {
      id: "address",
      label: "Address",
      minWidth: 100,
      align: "center",
    },
  ];

  return (
    <>
      <Snackbar
        open={
          deleteSuccess ||
          deleteError ||
          appointmentSuccess ||
          appointmentError ||
          imageSuccess ||
          imageError ||
          authError
        }
        autoHideDuration={2000}
        onClose={() => {
          setDeleteSuccess(false);
          setDeleteError(false);
          setImageSuccess(false);
          setImageError(false);
          setAppointmentError(false);
          setAppointmentSuccess(false);
          setAuthError(false);
        }}
      >
        <Alert
          onClose={() => {
            setDeleteSuccess(false);
            setDeleteError(false);
            setImageSuccess(false);
            setImageError(false);
            setAppointmentError(false);
            setAppointmentSuccess(false);
            setAuthError(false);
          }}
          severity={
            deleteError || appointmentError || imageError || authError
              ? "error"
              : "success"
          }
        >
          {deleteError && "Cannot delete the record !"}
          {deleteSuccess && "Successfully deleted the record !"}
          {appointmentError && "Cannot set the new appointment !"}
          {appointmentSuccess && "Appointment updated successfully !"}
          {imageError && "Cannot upload images"}
          {imageSuccess && "Successfully uploaded the images !"}
          {authError && "You are unauthorized user, please login first !"}
        </Alert>
      </Snackbar>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedImages([]);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          {modalContentLoading ? (
            <>
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                <h3>PATIENT INFO</h3>
              </div>
              <Grid container>
                <Grid item xs={6}>
                  Date of visit
                </Grid>
                <Grid item xs={6}>
                  <p>
                    {!!patient.visit_date ? (
                      <>{moment(patient.visit_date).format("DD-MM-YYYY")}</>
                    ) : (
                      "---"
                    )}
                  </p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Name
                </Grid>
                <Grid item xs={6}>
                  <p>{!!patient.name ? <>{patient.name}</> : "---"}</p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Age
                </Grid>
                <Grid item xs={6}>
                  <p>{!!patient.age ? <>{patient.age}</> : "---"}</p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Gender
                </Grid>
                <Grid item xs={6}>
                  <p>{!!patient.gender ? <>{patient.gender}</> : "---"}</p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  E-Mail
                </Grid>
                <Grid item xs={6}>
                  <p>{!!patient.email ? <>{patient.email}</> : "---"}</p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Phone Number
                </Grid>
                <Grid item xs={6}>
                  <p>
                    {!!patient.phone_number ? (
                      <>{patient.phone_number}</>
                    ) : (
                      "---"
                    )}
                  </p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Address
                </Grid>
                <Grid item xs={6}>
                  <p>{!!patient.address ? <>{patient.address}</> : "---"}</p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Payment Method
                </Grid>
                <Grid item xs={6}>
                  <p>
                    {!!patient.payment_method ? (
                      <>{patient.payment_method}</>
                    ) : (
                      "---"
                    )}
                  </p>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  Total Treatments
                </Grid>
                <Grid item xs={6}>
                  <p>
                    {!!patient.total_treatments ? (
                      <>{patient.total_treatments}</>
                    ) : (
                      "---"
                    )}
                  </p>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6}>
                  Total Cost
                </Grid>
                <Grid item xs={6}>
                  <p>
                    {!!patient.total_cost ? (
                      <>₹ {patient.total_cost} /-</>
                    ) : (
                      "---"
                    )}
                  </p>
                </Grid>
              </Grid>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container>
                  <Grid item xs={6}>
                    Next Appointment Date
                  </Grid>
                  <Grid item xs={6}>
                    <KeyboardDatePicker
                      clearable
                      value={selectedDate}
                      label="Appointment Date"
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      format="MM/dd/yyyy"
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container>
                  <Grid item xs={6}>
                    Next Appointment Time
                  </Grid>
                  <Grid item xs={6}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Appointment Time"
                      value={selectedTime}
                      onChange={(date) => {
                        setSelectedTime(date);
                        setSelectedTimeString(
                          moment(date.getTime(), "x").format("hh:mm A")
                        );
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>

              <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setNextAppointment(patient._id)}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>

              {!!patient.treatments && patient.treatments.length !== 0 && (
                <>
                  <Grid container style={{ marginTop: "30px" }}>
                    <Grid item xs={6}>
                      TREATMENTS
                    </Grid>
                    <Grid item xs={6}>
                      CHARGES
                    </Grid>
                  </Grid>
                  {patient.treatments.map((treatment, index) => {
                    return (
                      <Grid container key={index}>
                        <Grid item xs={6}>
                          <p>{treatment.treatment}</p>
                        </Grid>
                        <Grid item xs={6}>
                          <p>₹ {treatment.charges} /-</p>
                        </Grid>
                      </Grid>
                    );
                  })}
                </>
              )}

              <hr />

              <div
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                  marginBottom: "30px",
                }}
              >
                <label
                  htmlFor="images"
                  style={{
                    cursor: "pointer",
                    border: "1px solid gray",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <i
                    className="lni-cloud-upload"
                    style={{
                      marginRight: "5px",
                      fontSize: "25px",
                      fontWeight: "bolder",
                    }}
                  />
                  <span>Select images</span>
                </label>
                <input
                  id="images"
                  onChange={(e) => {
                    let arr = [];
                    for (let file of e.target.files) {
                      arr.push(file);
                    }
                    setSelectedImages(arr);
                  }}
                  type="file"
                  multiple
                  style={{
                    position: "absolute",
                    opacity: 0,
                    zIndex: -1,
                    width: "100%",
                  }}
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                }}
              >
                <Button
                  disabled={selectedImages.length === 0 ? true : false}
                  variant="outlined"
                  size="small"
                  onClick={() => onUploadPhotos(patient._id)}
                >
                  {selectedImages.length === 0 ? (
                    "Upload Patient Photos"
                  ) : (
                    <>Upload {selectedImages.length} Photos</>
                  )}
                </Button>
              </div>

              <Grid container>
                {!!images &&
                  images.map((image, index) => {
                    return (
                      <Grid item md={4} xs={6} key={index}>
                        <img
                          src={`data:image/${
                            image.contentType
                          };base64,${image.data.toString("base64")}`}
                          alt="patient gallery"
                          style={{
                            width: "auto",
                            height: "100px",
                          }}
                        />
                      </Grid>
                    );
                  })}
              </Grid>

              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <Link
                  to={{
                    pathname: "/printbill",
                    state: { patient: patient },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "5px", marginTop: "5px" }}
                    size="small"
                  >
                    Print Bill
                  </Button>
                </Link>

                <Link
                  to={{
                    pathname: "/printprescription",
                    state: { patient: patient },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginRight: "5px", marginTop: "5px" }}
                  >
                    Print Prescription
                  </Button>
                </Link>
              </div>
              <br />
              <div style={{ textAlign: "center" }}>
                <Link
                  to={{
                    pathname: "/updatepatient",
                    state: { id: patient._id },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "5px", marginTop: "5px" }}
                    size="small"
                  >
                    Update Record
                  </Button>
                </Link>

                <Button
                  onClick={() => deleteRecord(patient._id)}
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{ marginRight: "5px", marginTop: "5px" }}
                >
                  Delete Patient
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow style={{ textAlign: "center" }}>
                  <TableCell></TableCell>
                  <TableCell align="center">
                    <CircularProgress />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ) : (
                <>
                  {records
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleModalOpen(row._id)}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={records.length}
          rowsPerPage={10}
          page={page}
          onChangePage={handleChangePage}
        />
      </Paper>
    </>
  );
};

export default Records;
