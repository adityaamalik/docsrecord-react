import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
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
      <Row align="middle">
        <Col span={10}>
          <S.Logo src={Logo} alt="Logo" />
        </Col>

        <Col span={14}>
          <h2>MEDICAL INVOICE</h2>
          <br />
          <h4>
            <strong>Dr. {doc.name}</strong>
          </h4>
          <h4>{doc.clinic_name}</h4>
          <h4>{doc.clinic_address}</h4>
          <h4>{doc.phone_number}</h4>
        </Col>
      </Row>

      <S.PatientInfo>
        <Row>
          <Col span={12}>
            <h4>Patient Name : </h4>
          </Col>
          <Col span={12}>
            <h4>{patient.name}</h4>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h4>Address : </h4>
          </Col>
          <Col span={12}>
            <h4>{patient.address}</h4>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h4>Phone Number : </h4>
          </Col>
          <Col span={12}>
            <h4>{patient.phone_number}</h4>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h4>Age : </h4>
          </Col>
          <Col span={12}>
            <h4>{patient.age}</h4>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h4>Gender : </h4>
          </Col>
          <Col span={12}>
            <h4>{patient.gender}</h4>
          </Col>
        </Row>
      </S.PatientInfo>

      <S.TreatmentContainer>
        {patient.treatments && (
          <Row>
            <Col span={8}>
              <h3>
                <strong>S. No.</strong>
              </h3>
            </Col>
            <Col span={8}>
              <h3>
                <strong>Treatment</strong>
              </h3>
            </Col>
            <Col span={8}>
              <h3>
                <strong>Charges</strong>
              </h3>
            </Col>
          </Row>
        )}

        {patient.treatments && <hr />}
        {patient.treatments &&
          patient.treatments.map((treatment, index) => {
            return (
              <>
                <Row>
                  <Col span={8}>
                    <h3>{index + 1}</h3>
                  </Col>
                  <Col span={8}>
                    <h3>{treatment.treatment}</h3>
                  </Col>
                  <Col span={8}>
                    <h3>₹ {treatment.charges}</h3>
                  </Col>
                </Row>
                <hr />
              </>
            );
          })}

        <br />
        <br />

        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <h3>
              <strong>Consultation fee :</strong>
            </h3>
          </Col>
          <Col span={8}>₹ {doc.visit_charges}</Col>
        </Row>

        <br />

        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <h3>
              <strong>Total bill :</strong>
            </h3>
          </Col>
          <Col span={8}>₹ {doc.visit_charges + patient.total_cost}</Col>
        </Row>

        <br />

        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <h3>
              <strong>Payment Method :</strong>
            </h3>
          </Col>
          <Col span={8}>{patient.payment_method}</Col>
        </Row>
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
