import * as S from "./styles";
import ImageUrl from "../../img/doc.png";
import { useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import axios from "axios";
import { message } from "antd";
import WaitingRoom from "../../img/waitingroom.jpg";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    axios
      .post("/doctors/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("docsrecordDoctor", response.data.doctor);
        localStorage.setItem("token", response.data.token);

        window.location.pathname = "/records";
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data === "email incorrect") {
          message.error("This email is not registered !");
        } else if (err.response.data === "password incorrect") {
          message.error("Password is wrong. Please try again !");
        } else {
          message.error("Some error occured !");
        }
      });
  };

  return (
    <div style={{ position: "relative" }}>
      <img
        src={WaitingRoom}
        alt="clinic waiting room"
        style={{
          position: "absolute",
          opacity: "0.6",
          height: "100vh",
          width: "auto",
          left: "0",
          top: "0",
        }}
      />
      <S.MainRow align="middle" style={{ position: "relative" }}>
        <S.MainCol lg={14} md={24} sm={24} xs={24}>
          <S.Image src={ImageUrl} />
          <br />
          <S.Heading>DOCSRECORD</S.Heading>
          <br />
          <S.SubHeading>KEEP RECORDS. SAFELY.</S.SubHeading>
          <br />
          <br />
          <Button onClick={() => (window.location.pathname = "/signup")}>
            7 days free trial
          </Button>
        </S.MainCol>
        <S.MainCol lg={1} md={1} sm={0} xs={0} style={{ height: "100%" }}>
          <div
            style={{ width: "1px", height: "100%", backgroundColor: "gray" }}
          ></div>
        </S.MainCol>
        <S.MainCol lg={8} md={24} sm={24} xs={24}>
          <S.SubHeading>
            SIGN IN OR <a href="/signup">SIGN UP</a>
          </S.SubHeading>

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

          <Button onClick={onSubmit}>SIGN IN</Button>
        </S.MainCol>
        <S.MainCol lg={1} md={1} sm={0} xs={0}></S.MainCol>
      </S.MainRow>
    </div>
  );
};

export default Landing;
