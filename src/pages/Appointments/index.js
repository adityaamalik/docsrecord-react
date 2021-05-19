import { Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import * as S from "./styles";
import axios from "axios";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

const Appointments = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !")
            .then(() => (window.location.pathname = "/login"));
        }
      });
  }, []);

  const tConvert = (time) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };

  const title = (name, date, time, gender) => {
    return (
      <Row>
        <Col span={12}>
          <strong>{name}</strong>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          Date : {moment(date).format("MMMM Do YYYY")}
        </Col>
        <Col span={12}>({gender})</Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {!!time && <>Time : {tConvert(time)}</>}
        </Col>
      </Row>
    );
  };

  return (
    <>
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

        <S.AppointmentCardContainer>
          <S.CustomRow>
            {!!records &&
              records.length !== 0 &&
              records.map((record, index) => {
                return (
                  <Col lg={8} md={12} sm={24} xs={24} key={index}>
                    <S.AppointmentCard
                      size="small"
                      title={title(
                        record.name,
                        record.next_appointment_date,
                        record.next_appointment_time,
                        record.gender
                      )}
                    >
                      <Row style={{ marginBottom: "20px" }}>
                        <Col>Patient no : {index + 1}</Col>
                      </Row>

                      {!!record.phone_number && (
                        <Row style={{ marginBottom: "20px" }}>
                          <Col>Phone Number : +91 - {record.phone_number}</Col>
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
                              <Col span={12}>₹ {treatment.charges} /-</Col>
                            </Row>
                          );
                        })}

                      {!!record.total_cost && (
                        <Row style={{ marginBottom: "20px" }}>
                          <Col>Total Cost : ₹ {record.total_cost} /-</Col>
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
