import * as S from "./styles";
import { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { RightOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = () => {
    axios
      .post("http://localhost:3000/doctors/register", {
        name: name,
        clinic_name: clinicName,
        clinic_address: clinicAddress,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);

        localStorage.setItem("docsrecordJwtToken", response.data.token);
        localStorage.setItem("docsrecordDoctor", response.data.doctor._id);

        window.location.pathname = "/records";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Row align="middle" justify="center">
        <Col lg={24} style={{ textAlign: "center", marginTop: "50px" }}>
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
        </Col>
      </Row>
    </>
  );
};

export default Signup;
