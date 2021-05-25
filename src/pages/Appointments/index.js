import { useEffect, useState } from "react";
import * as S from "./styles";
import axios from "axios";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Button, Grid, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: "15px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Appointments = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const [authError, setAuthError] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [completedError, setCompletedError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");

    axios
      .get(`/patients/appointments/${doctor}`)
      .then((response) => {
        setRecords(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          setAuthError(true);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 1000);
        }
      });
  }, []);

  const complete = (id) => {
    let today = new Date();
    today.setDate(today.getDate() - 2);
    axios
      .put(`/patients/${id}`, { next_appointment_date: today })
      .then((response) => {
        console.log(response);
        var users = records.filter(function (record) {
          return record._id !== id;
        });
        setRecords(users);
        setCompletedSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setCompletedError(true);
      });
  };

  const title = (name, date, time, gender) => {
    return (
      <Grid container justify="space-around">
        <Grid item xs={10}>
          <strong style={{ fontSize: "20px" }}>{name}</strong>
        </Grid>
        <Grid item xs={2}>
          {gender}
        </Grid>
        <Grid item xs={9}>
          Date : {moment(date).format("Do MMM YYYY")}
        </Grid>
        <Grid item xs={3}>
          {!!time && <>{time}</>}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Snackbar
        open={authError || completedError || completedSuccess}
        autoHideDuration={2000}
        onClose={() => {
          setAuthError(false);
          setCompletedError(false);
          setCompletedSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            setAuthError(false);
            setCompletedError(false);
            setCompletedSuccess(false);
          }}
          severity={authError || completedError ? "error" : "success"}
        >
          {authError && "You are unauthorized, please login first!"}
          {completedError && "Cannot mark as completed, try again please !"}
          {completedSuccess && "Appointment marked as completed !"}
        </Alert>
      </Snackbar>
      <S.Container>
        <S.Heading>
          {isLoading ? (
            <LoadingOutlined style={{ fontSize: "50px" }} />
          ) : (
            <>
              {records.length === 0
                ? "NO UPCOMING APPOINTMENTS"
                : "UPCOMING APPOINTMENTS"}
            </>
          )}
        </S.Heading>
        <Grid container spacing={2}>
          {!!records &&
            records.length !== 0 &&
            records.map((record, index) => {
              return (
                <Grid item md={4} sm={6} xs={12} alignItems="center">
                  <Card className={classes.root} variant="outlined">
                    <S.CardDiv>
                      {title(
                        record.name,
                        record.next_appointment_date,
                        record.next_appointment_time,
                        record.gender
                      )}
                    </S.CardDiv>
                    <hr />
                    <Grid container>
                      <Grid item xs={12}>
                        Patient no : {index + 1}
                      </Grid>
                      <Grid item xs={12}>
                        Phone Number : +91 - {record.phone_number}
                      </Grid>
                    </Grid>

                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      {!!record.treatments && (
                        <Grid container>
                          <Grid item xs={6}>
                            <S.CardDiv>
                              <strong>Treatment</strong>
                            </S.CardDiv>
                          </Grid>
                          <Grid item xs={6}>
                            <S.CardDiv>
                              <strong>Charges</strong>
                            </S.CardDiv>
                          </Grid>
                        </Grid>
                      )}
                    </div>

                    <div style={{ textAlign: "center" }}>
                      {!!record.treatments &&
                        record.treatments.map((treatment, i) => {
                          return (
                            <Grid container>
                              <Grid item xs={6}>
                                <S.CardDiv>{treatment.treatment}</S.CardDiv>
                              </Grid>
                              <Grid item xs={6}>
                                <S.CardDiv>₹ {treatment.charges} /-</S.CardDiv>
                              </Grid>
                            </Grid>
                          );
                        })}
                    </div>

                    {!!record.total_cost && (
                      <Grid item xs={12}>
                        <S.CardDiv>
                          <strong>Total Cost : ₹ {record.total_cost} /-</strong>
                        </S.CardDiv>
                      </Grid>
                    )}

                    <div style={{ textAlign: "right" }}>
                      <Button
                        style={{
                          borderRadius: "50px",
                          color: "#004aad",
                        }}
                        onClick={() => complete(record._id)}
                        col
                      >
                        <i
                          className="lni-check-mark-circle"
                          style={{
                            fontWeight: "bolder",
                            fontSize: "20px",
                            marginRight: "5px",
                          }}
                        />
                        MARK AS COMPLETED
                      </Button>
                    </div>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </S.Container>
    </>
  );
};

export default Appointments;
