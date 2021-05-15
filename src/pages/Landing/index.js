import * as S from "./styles";
import ImageUrl from "../../img/doc.png";
import { useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import axios from "axios";
import { message, Modal, Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CloseCircleOutlined } from "@ant-design/icons";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMonthlyModalVisible, setIsMonthlyModalVisible] = useState(false);
  const [isYearlyModalVisible, setIsYearlyModalVisible] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [token, setToken] = useState("");
  const [islogin, setIslogin] = useState(false);

  // states for register
  const [name, setName] = useState("");
  const [emailForRegister, setEmailForRegister] = useState("");
  const [passwordForRegister, setPasswordForRegister] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [loginForm, toggleLoginForm] = useState(true);

  const onSubmitForRegister = () => {
    if (!name) {
      message.error("Name is required");
      setIslogin(false);
    } else if (!emailForRegister) {
      message.error("Email is required");
      setIslogin(false);
    } else if (!passwordForRegister) {
      message.error("Password is required");
      setIslogin(false);
    } else if (passwordForRegister !== confirmPassword) {
      message.error("Password does not match");
      setIslogin(false);
    } else if (!phone) {
      message.error("Phone Number is required");
      setIslogin(false);
    } else {
      setIsRegister(true);
      axios
        .post("/doctors/register", {
          name: name,
          email: emailForRegister,
          password: passwordForRegister,
          phone_number: phone,
        })
        .then((response) => {
          setIsRegister(false);

          localStorage.setItem("docsrecordDoctor", response.data.doctor._id);
          localStorage.setItem("token", response.data.token);

          window.location.pathname = "/records";
        })
        .catch((err) => {
          setIsRegister(false);
          console.log(err.message);
          message.error("Some error occured !");
        });
    }
  };

  const onSubmit = () => {
    setIslogin(true);

    axios
      .post("/doctors/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setIslogin(false);
        var today = new Date();
        var payment = new Date(response.data.doctor.payment_valid_till);
        setDoctor(response.data.doctor);
        if (today > payment) {
          setToken(response.data.token);
          setIsModalVisible(true);
        } else {
          localStorage.setItem("docsrecordDoctor", response.data.doctor._id);
          localStorage.setItem("token", response.data.token);

          window.location.pathname = "/records";
        }
      })
      .catch((err) => {
        setIslogin(false);
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

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let login = (
    <Button onClick={onSubmit} width="150px" height="35px">
      SIGN IN
    </Button>
  );
  if (islogin === true) {
    login = <Spin indicator={antIcon} />;
  }

  let register = (
    <Button onClick={onSubmitForRegister} width="150px" height="35px">
      REGISTER
    </Button>
  );
  if (isRegister === true) {
    register = <Spin indicator={antIcon} />;
  }

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (subscription) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await axios.post("/payments/orders", {
      subscription: subscription,
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_wWXoxoQf1kjrSm", // Enter the Key ID generated from the Dashboard
      amount: amount * 100,
      currency: currency,
      name: "DOCSRECORD",
      description: `DOCSRECORD ${subscription} subscription.`,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          doctorId: doctor._id,
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          subscription: subscription,
        };

        const result = await axios.post("/payments/success", data);

        console.log(result.data.statusCode);
        message.success(result.data.msg).then(() => {
          localStorage.setItem("docsrecordDoctor", doctor._id);
          localStorage.setItem("token", token);
          window.location.pathname = "/records";
        });
      },
      prefill: {
        name: doctor.name,
        email: doctor.email,
        contact: doctor.phone_number,
      },
      notes: {
        address: doctor.address,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* main modal */}
      <Modal
        footer={null}
        centered
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        closable={false}
        bodyStyle={{ backgroundColor: "#fff" }}
      >
        <div style={{ textAlign: "right" }}>
          <CloseCircleOutlined
            style={{ color: "black", fontSize: "20px" }}
            onClick={() => setIsModalVisible(false)}
          />
        </div>

        <h1>Payment Due</h1>
        <h3>
          Your plan has expired. To continue using docsrecord, please choose a
          monthly or an yearly subscription.
        </h3>
        <h3>Click on monthly or yearly button to check the details.</h3>
        <Row justify="center" align="middle" style={{ textAlign: "center" }}>
          <Col span={11}>
            <Button width="30" onClick={() => setIsMonthlyModalVisible(true)}>
              Monthly subscription
            </Button>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <Button width="30" onClick={() => setIsYearlyModalVisible(true)}>
              Yearly subscription
            </Button>
          </Col>
        </Row>
        <br />
        <p>
          Contact Support for any queries : +91 - 8130083852 |
          codeclan0100@gmail.com
        </p>
      </Modal>

      {/* monthly modal */}
      <Modal
        footer={null}
        centered
        visible={isMonthlyModalVisible}
        onCancel={() => setIsMonthlyModalVisible(false)}
        closable={false}
        bodyStyle={{ backgroundColor: "#fff" }}
      >
        <div style={{ textAlign: "right" }}>
          <CloseCircleOutlined
            style={{ color: "black", fontSize: "20px" }}
            onClick={() => setIsMonthlyModalVisible(false)}
          />
        </div>

        <h1>Monthly Plan</h1>
        <h3>Your subscription will be extended for 1 Month.</h3>
        <h3>Amount : ₹ 500</h3>
        <Row justify="center" align="middle" style={{ textAlign: "center" }}>
          <Col span={24}>
            <Button width="30" onClick={() => displayRazorpay("monthly")}>
              Continue to payment
            </Button>
          </Col>
        </Row>
        <br />
        <p>
          Contact Support for any queries : +91 - 8130083852 |
          codeclan0100@gmail.com
        </p>
      </Modal>

      {/* yearly modal */}
      <Modal
        footer={null}
        centered
        visible={isYearlyModalVisible}
        onCancel={() => setIsYearlyModalVisible(false)}
        closable={false}
        bodyStyle={{ backgroundColor: "#fff" }}
      >
        <div style={{ textAlign: "right" }}>
          <CloseCircleOutlined
            style={{ color: "black", fontSize: "20px" }}
            onClick={() => setIsYearlyModalVisible(false)}
          />
        </div>

        <h1>Yearly Plan</h1>
        <h3>Your subscription will be extended for 1 Year.</h3>
        <h3>Amount : ₹ 5000</h3>
        <Row justify="center" align="middle" style={{ textAlign: "center" }}>
          <Col span={24}>
            <Button width="30" onClick={() => displayRazorpay("yearly")}>
              Continue to payment
            </Button>
          </Col>
        </Row>
        <br />
        <p>
          Contact Support for any queries : +91 - 8130083852 |
          codeclan0100@gmail.com
        </p>
      </Modal>

      <S.MainRow align="middle" style={{ position: "relative" }}>
        <S.MainCol lg={14} md={24} sm={24} xs={24}>
          <S.Image src={ImageUrl} />
          <br />
          <S.Heading>DOCSRECORD</S.Heading>
          <br />
          <S.SubHeading>KEEP RECORDS. SAFELY.</S.SubHeading>
        </S.MainCol>
        <S.MainCol lg={1} md={1} sm={0} xs={0} style={{ height: "100%" }}>
          <div
            style={{ width: "1px", height: "100%", backgroundColor: "gray" }}
          ></div>
        </S.MainCol>
        <S.MainCol lg={8} md={24} sm={24} xs={24}>
          {loginForm ? (
            <div>
              <S.SubHeading>
                SIGN IN OR{" "}
                <a href="/#" onClick={() => toggleLoginForm(!loginForm)}>
                  REGISTER
                </a>
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

              {/* <Button onClick={onSubmit}>SIGN IN</Button> */}
              {login}
              <br />
              <br />
            </div>
          ) : (
            <div>
              <S.SubHeading>
                REGISTER OR{" "}
                <a href="/#" onClick={() => toggleLoginForm(!loginForm)}>
                  SIGN IN
                </a>
              </S.SubHeading>

              <Input
                type="text"
                value={name}
                onChange={(val) => setName(val)}
                label="Name"
              />

              <Input
                type="tel"
                value={phone}
                onChange={(val) => setPhone(val)}
                label="Phone Number"
              />

              <Input
                type="email"
                value={emailForRegister}
                onChange={(val) => setEmailForRegister(val)}
                label="E-Mail"
              />

              <Input
                type="password"
                value={passwordForRegister}
                onChange={(val) => setPasswordForRegister(val)}
                label="Password"
              />

              <Input
                type="password"
                value={confirmPassword}
                onChange={(val) => setConfirmPassword(val)}
                label="Confirm Password"
              />

              {register}
              <br />
              <br />
            </div>
          )}
        </S.MainCol>
        <S.MainCol lg={1} md={1} sm={0} xs={0}></S.MainCol>
      </S.MainRow>
    </div>
  );
};

export default Landing;
