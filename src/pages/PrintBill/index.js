import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import * as S from "./styles";
import Logo from "../../img/doc.png";

const PrintBill = (props) => {
  const { patient } = props.location.state;

  console.log("patient");
  console.log(patient);
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
    // document.getElementById("mainHeader").style.display = "none";
  }, [patient.doctor]);

  return (
    <S.Container>
      <Grid container>
        <Grid item xs={5}>
          <S.Logo src={Logo} alt="Logo" />
        </Grid>

        <Grid item xs={7}>
          <h2>MEDICAL INVOICE</h2>
          <br />
          <h4>
            <strong>Dr. {doc.name}</strong>
          </h4>
          <h4>{doc.clinic_name}</h4>
          <h4>{doc.clinic_address}</h4>
          <h4>{doc.phone_number}</h4>
        </Grid>
      </Grid>

      <S.PatientInfo>
        <Grid container>
          <Grid item xs={6}>
            <h4>Patient Name : </h4>
          </Grid>
          <Grid item xs={6}>
            <h4>{patient.name}</h4>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <h4>Address : </h4>
          </Grid>
          <Grid item xs={6}>
            <h4>{patient.address}</h4>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <h4>Phone Number : </h4>
          </Grid>
          <Grid item xs={6}>
            <h4>{patient.phone_number}</h4>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <h4>Age : </h4>
          </Grid>
          <Grid item xs={6}>
            <h4>{patient.age}</h4>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <h4>Gender : </h4>
          </Grid>
          <Grid item xs={6}>
            <h4>{patient.gender}</h4>
          </Grid>
        </Grid>
      </S.PatientInfo>

      <S.TreatmentContainer>
        {patient.treatments && (
          <Grid container>
            <Grid item xs={4}>
              <h3>
                <strong>S. No.</strong>
              </h3>
            </Grid>
            <Grid item xs={4}>
              <h3>
                <strong>Treatment</strong>
              </h3>
            </Grid>
            <Grid item xs={4}>
              <h3>
                <strong>Charges</strong>
              </h3>
            </Grid>
          </Grid>
        )}

        {patient.treatments && <hr />}
        {patient.treatments &&
          patient.treatments.map((treatment, index) => {
            return (
              <>
                <Grid container>
                  <Grid item xs={4}>
                    <h3>{index + 1}</h3>
                  </Grid>
                  <Grid item xs={4}>
                    <h3>{treatment.treatment}</h3>
                  </Grid>
                  <Grid item xs={4}>
                    <h3>₹ {treatment.charges}</h3>
                  </Grid>
                </Grid>
                <hr />
              </>
            );
          })}

        <br />
        <br />

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <h3>
              <strong>Consultation fee :</strong>
            </h3>
          </Grid>
          <Grid item xs={4}>
            ₹ {doc.visit_charges}
          </Grid>
        </Grid>

        <br />

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <h3>
              <strong>Total bill :</strong>
            </h3>
          </Grid>
          <Grid item xs={4}>
            ₹ {doc.visit_charges + patient.total_cost}
          </Grid>
        </Grid>

        <br />

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <h3>
              <strong>Payment Method :</strong>
            </h3>
          </Grid>
          <Grid item xs={4}>
            {patient.payment_method}
          </Grid>
        </Grid>
      </S.TreatmentContainer>

      <div id="printBtn" style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            document.getElementById("printBtn").style.display = "none";
            window.print();
          }}
        >
          Print Bill
        </Button>
      </div>

      <br />
      <br />
    </S.Container>
  );
};

export default PrintBill;
