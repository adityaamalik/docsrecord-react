import * as S from "./styles";
import { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { RightOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

const Signup = () => {
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

          <Button onClick={() => (window.location.pathname = "/records")}>
            SIGN UP
            <RightOutlined />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Signup;
