import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Button } from "@material-ui/core";
import * as S from "./styles";

const PrintPrescription = (props) => {
  const { patient } = props.location.state;

  const [doc, setDoc] = useState({});

  useEffect(() => {
    if (!!patient.doctor) {
      axios
        .get(`/doctors/${patient.doctor}`)
        .then((response) => {
          setDoc(response.data);
          console.log("Doctor");
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.location.pathname = "/records";
    }
  }, [patient.doctor]);

  return (
    <S.Container>
      <S.TopContainer>
        <h1>
          <strong>{doc.clinic_name}</strong>
        </h1>
        <br />
        <h2>
          Dr. {doc.name} ( {doc.qualifications} )
        </h2>
        <h4>{doc.clinic_address}</h4>
        <h4>{doc.phone_number}</h4>
      </S.TopContainer>

      <hr />

      <Grid container style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <strong>Patient Name</strong> :{" "}
          <S.UnderlinedSpan>{patient.name}</S.UnderlinedSpan>
        </Grid>
        <Grid item xs={3}>
          <strong>Age</strong> :{" "}
          <S.UnderlinedSpan>{patient.age}</S.UnderlinedSpan>
        </Grid>
        <Grid item xs={3}>
          <strong>Gender</strong>:{" "}
          <S.UnderlinedSpan>{patient.gender}</S.UnderlinedSpan>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "30px" }}>
        <Grid item xs={9}>
          <strong>Address</strong> :{" "}
          <S.UnderlinedSpan>{patient.address}</S.UnderlinedSpan>
        </Grid>
        <Grid item xs={3}>
          <strong>Date</strong> :
        </Grid>
      </Grid>

      <S.EmptyDiv></S.EmptyDiv>
      <br />
      <br />
      <div id="printBtn" style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            document.getElementById("printBtn").style.display = "none";
            window.print();
          }}
        >
          Print Prescription
        </Button>
      </div>

      <br />
      <br />
    </S.Container>
  );
};

export default PrintPrescription;
