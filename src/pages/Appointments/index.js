import { Col } from "antd";
import * as S from "./styles";

const Appointments = () => {
  return (
    <>
      <S.Container>
        <S.Heading>UPCOMING APPOINTMENTS</S.Heading>

        <S.AppointmentCardContainer>
          <S.Date>Date : 1/1/2021</S.Date>
          <S.CustomRow>
            <Col lg={8} md={12} sm={24} xs={24}>
              <S.AppointmentCard size="small" title="Patient Name">
                <p>Treatment</p>
                <p>S.AppointmentCard content</p>
                <p>S.AppointmentCard content</p>
              </S.AppointmentCard>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <S.AppointmentCard size="small" title="Patient Name">
                <p>Treatment</p>
                <p>S.AppointmentCard content</p>
                <p>S.AppointmentCard content</p>
              </S.AppointmentCard>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <S.AppointmentCard size="small" title="Patient Name">
                <p>Treatment</p>
                <p>S.AppointmentCard content</p>
                <p>S.AppointmentCard content</p>
              </S.AppointmentCard>
            </Col>
          </S.CustomRow>
        </S.AppointmentCardContainer>

        <S.AppointmentCardContainer>
          <S.Date>Date : 1/1/2021</S.Date>
          <S.CustomRow>
            <Col lg={8} md={12} sm={24} xs={24}>
              <S.AppointmentCard size="small" title="Patient Name">
                <p>Treatment</p>
                <p>S.AppointmentCard content</p>
                <p>S.AppointmentCard content</p>
              </S.AppointmentCard>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <S.AppointmentCard size="small" title="Patient Name">
                <p>Treatment</p>
                <p>S.AppointmentCard content</p>
                <p>S.AppointmentCard content</p>
              </S.AppointmentCard>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <S.AppointmentCard size="small" title="Patient Name">
                <p>Treatment</p>
                <p>S.AppointmentCard content</p>
                <p>S.AppointmentCard content</p>
              </S.AppointmentCard>
            </Col>
          </S.CustomRow>
        </S.AppointmentCardContainer>
      </S.Container>
    </>
  );
};

export default Appointments;
