import { Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import * as S from "./styles";
import axios from "axios";
import moment from "moment";

const Appointments = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const doctor = localStorage.getItem("docsrecordDoctor");

    axios
      .get(`/patients?doctor=${doctor}`)
      .then((response) => {
        // console.log(response.data);
        const temp = [];
        response.data.forEach((record) => {
          if (
            record.next_appointment_date !== undefined &&
            record.next_appointment_date !== null
          ) {
            console.log(record);
            var today = moment();
            var appointdate = moment(record.next_appointment_date);
            if (appointdate >= today) temp.push(record);
          }
        });
        setRecords(
          temp.sort((a, b) => {
            return (
              new Date(a.next_appointment_date) -
              new Date(b.next_appointment_date)
            );
          })
        );
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !")
            .then(() => (window.location.pathname = "/login"));
        }
      });
  }, []);
  console.log(records);

  const title = (name, date) => {
    return (
      <Row>
        <Col span={12}>{name}</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {moment(date).format("MMMM Do YYYY, h:mm:ss a")}
        </Col>
      </Row>
    );
  };

  return (
    <>
      <S.Container>
        <S.Heading>UPCOMING APPOINTMENTS</S.Heading>

        <S.AppointmentCardContainer>
          <S.CustomRow>
            {!!records &&
              records.length !== 0 &&
              records.map((record, index) => {
                return (
                  <Col lg={8} md={12} sm={24} xs={24} key={index}>
                    <S.AppointmentCard
                      size="small"
                      title={title(record.name, record.next_appointment_date)}
                    >
                      <Row style={{ marginBottom: "20px" }}>
                        <Col>Patient no : {index + 1}</Col>
                      </Row>

                      {!!record.phone_number && (
                        <Row style={{ marginBottom: "20px" }}>
                          <Col>Phone Number : {record.phone_number}</Col>
                        </Row>
                      )}

                      {!!record.treatments && (
                        <Row style={{ marginBottom: "20px" }}>
                          <Col span={12}>
                            <strong>Treatment</strong>
                          </Col>
                          <Col span={12}>
                            <strong>Charges</strong>
                          </Col>
                        </Row>
                      )}

                      {!!record.treatments &&
                        record.treatments.map((treatment, i) => {
                          return (
                            <Row key={i}>
                              <Col span={12}>{treatment.treatment}</Col>
                              <Col span={12}>₹ {treatment.charges}</Col>
                            </Row>
                          );
                        })}

                      {!!record.total_cost && (
                        <Row style={{ marginBottom: "20px" }}>
                          <Col>Total Cost : {record.total_cost}</Col>
                        </Row>
                      )}
                    </S.AppointmentCard>
                  </Col>
                );
              })}
          </S.CustomRow>
        </S.AppointmentCardContainer>
      </S.Container>
    </>
  );
};

export default Appointments;
