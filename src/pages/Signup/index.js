import * as S from "./styles";
import { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { RightOutlined } from "@ant-design/icons";
import { Row, Col, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import SignupImg from "../../img/doctors.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  // const [clinicName, setClinicName] = useState("");
  // const [clinicAddress, setClinicAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [qualifications, setQualifications] = useState("");
  // const [visitCharges, setVisitCharges] = useState("");
  // const [timings, setTimings] = useState("");
  // const [image, setImage] = useState({});
  const [phone, setPhone] = useState("");
  const [islogin, setIslogin] = useState(false);

  const onSubmit = () => {
    setIslogin(true);
    if (!name) {
      message.error("Name is required");
      setIslogin(false);
    } else if (!email) {
      message.error("Email is required");
      setIslogin(false);
    } else if (!password) {
      message.error("Password is required");
      setIslogin(false);
    } else if (password !== confirmPassword) {
      message.error("Password does not match");
      setIslogin(false);
    } else if (!phone) {
      message.error("Phone Number is required");
      setIslogin(false);
    } else {
      axios
        .post("/doctors/register", {
          name: name,
          // clinic_name: clinicName,
          // clinic_address: clinicAddress,
          email: email,
          password: password,
          // qualifications: qualifications,
          // visit_charges: visitCharges,
          phone_number: phone,
        })
        .then((response) => {
          console.log(response.data);
          setIslogin(false);

          localStorage.setItem("docsrecordDoctor", response.data.doctor._id);
          localStorage.setItem("token", response.data.token);

          window.location.pathname = "/records";
        })
        .catch((err) => {
          setIslogin(false);
          console.log(err.message);
          message.error("Some error occured !");
        });
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let login = (
    <Button onClick={onSubmit}>
      SIGN UP <RightOutlined />
    </Button>
  );
  if (islogin === true) {
    login = <Spin indicator={antIcon} />;
  }

  return (
    <div style={{ position: "relative" }}>
      <S.WaitRoomImg src={SignupImg} />

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

          {/* <Input
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
          /> */}

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

          {/* <Button onClick={onSubmit}>
            SIGN UP
            <RightOutlined />
          </Button> */}
          {login}

          <S.SubHeading>
            Already Registered User? <a href="/landing">Login</a>
          </S.SubHeading>

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
