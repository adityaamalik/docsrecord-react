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
      .get(
        `/https://docsrecord-backend.herokuapp.compatients?doctor=${doctor}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const temp = [];
        response.data.forEach((record) => {
          if (
            record.next_appointment_date !== undefined &&
            record.next_appointment_date !== null &&
            record.next_appointment_date > moment().format("YYYY-MM-DD")
          ) {
            temp.push(record);
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

  const title = (name, date) => {
    return (
      <Row>
        <Col span={12}>{name}</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {moment(date).format("DD-MMM-YYYY")}
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
            {records.length !== 0 &&
              records.map((record, index) => {
                return (
                  <Col lg={8} md={12} sm={24} xs={24} key={index}>
                    <S.AppointmentCard
                      size="small"
                      title={title(record.name, record.next_appointment_date)}
                    >
                      {!!record.phone_number && (
                        <Row style={{ marginBottom: "20px" }}>
                          <Col>Phone Number : {record.phone_number}</Col>
                        </Row>
                      )}

                      <Row style={{ marginBottom: "20px" }}>
                        <Col span={12}>
                          <strong>Treatment</strong>
                        </Col>
                        <Col span={12}>
                          <strong>Charges</strong>
                        </Col>
                      </Row>

                      {record.treatments.map((treatment, i) => {
                        return (
                          <Row key={i}>
                            <Col span={12}>{treatment.treatment}</Col>
                            <Col span={12}>₹ {treatment.charges}</Col>
                          </Row>
                        );
                      })}
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
