import * as S from "./styles";
import { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { RightOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";
import axios from "axios";
import SignupImg from "../../img/doctors.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [visitCharges, setVisitCharges] = useState("");
  // const [timings, setTimings] = useState("");
  // const [image, setImage] = useState({});
  const [phone, setPhone] = useState("");

  const onSubmit = () => {
    axios
      .post("/doctors/register", {
        name: name,
        clinic_name: clinicName,
        clinic_address: clinicAddress,
        email: email,
        password: password,
        qualifications: qualifications,
        visit_charges: visitCharges,
        phone_number: phone,
      })
      .then((response) => {
        console.log(response.data);

        localStorage.setItem("docsrecordDoctor", response.data.doctor._id);

        window.location.pathname = "/records";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        src={SignupImg}
        alt="Sign up"
        style={{
          position: "absolute",
          opacity: "0.6",
          height: "auto",
          width: "50%",
          right: "0",
          top: "20%",
        }}
      />
      <Row align="middle" justify="center" style={{ position: "relative" }}>
        <Col span={1}></Col>
        <Col lg={11} style={{ textAlign: "center", marginTop: "50px" }}>
          <S.Heading>REGISTER</S.Heading>

          <Input
            type="text"
            value={name}
            onChange={(val) => setName(val)}
            label="Name"
          />

          <Input
            type="text"
            value={clinicName}
            onChange={(val) => setClinicName(val)}
            label="Clinic's Name"
          />

          <Input
            type="text"
            value={clinicAddress}
            onChange={(val) => setClinicAddress(val)}
            label="Clinic's Address"
          />

          <Input
            type="text"
            value={qualifications}
            onChange={(val) => setQualifications(val)}
            label="Qualifications"
          />

          <Input
            type="number"
            value={visitCharges}
            onChange={(val) => setVisitCharges(val)}
            label="Visit Charges"
          />

          <Input
            type="tel"
            value={phone}
            onChange={(val) => setPhone(val)}
            label="Phone Number"
          />

          <Input
            type="email"
            value={email}
            onChange={(val) => setEmail(val)}
            label="E-Mail"
          />

          <Input
            type="password"
            value={password}
            onChange={(val) => setPassword(val)}
            label="Password"
          />

          <Input
            type="password"
            value={confirmPassword}
            onChange={(val) => setConfirmPassword(val)}
            label="Confirm Password"
          />

          <Button onClick={onSubmit}>
            SIGN UP
            <RightOutlined />
          </Button>

          <br />
          <br />
        </Col>
        <Col span={1}></Col>
        <Col span={11}></Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
};

export default Signup;
