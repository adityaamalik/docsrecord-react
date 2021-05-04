import * as S from "./styles";
import ImageUrl from "../../img/doc.png";
import { useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import axios from "axios";
import { message, Modal } from "antd";
import WaitingRoom from "../../img/waitingroom.jpg";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [doctor, setDoctor] = useState({});

  const onSubmit = () => {
    axios
      .post("/doctors/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("docsrecordDoctor", response.data.doctor._id);
        localStorage.setItem("token", response.data.token);

        var today = new Date();
        var payment = new Date(response.data.doctor.payment_valid_till);
        console.log(today);
        console.log(payment);
        setDoctor(response.data.doctor);
        if (today.getTime() > payment.getTime()) {
          setIsModalVisible(true);
        } else {
          window.location.pathname = "/records";
        }
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
  // const loadScript = () => {
  //   const Script = document.createElement("script");
  //   //id should be same as given to form element
  //   const Form = document.getElementById("donateForm");
  //   Script.setAttribute(
  //     "src",
  //     "https://checkout.razorpay.com/v1/payment-button.js"
  //   );
  //   Script.setAttribute("data-payment_button_id", "pl_H6R4HFn11wkcrx");

  //   Form.appendChild(Script);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
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

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    // const result = await axios.post("/payment/orders", {
    //   amount: price,
    // });

    // if (!result) {
    //   alert("Server error. Are you online?");
    //   return;
    // }

    // Getting the order details back
    // const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_wWXoxoQf1kjrSm", // Enter the Key ID generated from the Dashboard
      amount: 700,
      name: "doc",
      description: "Payment for your order at doc store",

      handler: async function (response) {
        const data = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const doctor = localStorage.getItem("docsrecordDoctor");

        var pay = new Date();
        let offset = pay.getTimezoneOffset();
        pay = new Date(pay.getTime() - offset * 60000);
        pay = pay.setDate(pay.getDate() + 30);
        axios
          .put(`/doctors/${doctor}`, { payment_valid_till: pay })
          .then((response) => {})
          .catch((err) => {
            console.log(err);
            message.error("Some error occured");
          });

        message.success().then(() => (window.location.pathname = "/login"));
      },
      prefill: {
        name: doctor.name,
        email: doctor.email,
      },

      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // const submitOrder = () => {
  //   if (name === "") {
  //     message.error("Please fill the name");
  //   } else if (email === "") {
  //     message.error("Please fill the email");
  //   } else if (phone === "") {
  //     message.error("Please fill the phone number");
  //   } else if (address1 === "" && address2 === "") {
  //     message.error("Please provide an address");
  //   } else if (state === "") {
  //     message.error("Please fill the state");
  //   } else if (city === "") {
  //     message.error("Please fill the city");
  //   } else if (zip === "") {
  //     message.error("Please fill the zip code");
  //   } else if (paymentMethod === "") {
  //     message.error("Please enter the payment method");
  //   } else {
  //     // const fmData = new FormData();

  //     const orderItems = [];
  //     let totalPrice = 0;
  //     JSON.parse(localStorage.getItem("products")).forEach((product) => {
  //       const temp = {
  //         product: product.id,
  //         price: product.discountedPrice * product.quantity,
  //         quantity: parseInt(product.quantity),
  //         colour: product.colour,
  //       };

  //       orderItems.push(temp);

  //       totalPrice = totalPrice + product.discountedPrice * product.quantity;
  //     });

  //     const data = {
  //       name: name,
  //       email: email,
  //       phone: phone,
  //       shippingAddress1: address1,
  //       shippingAddress2: address2,
  //       city: city,
  //       state: state,
  //       zip: zip,
  //       orderItems: orderItems,
  //       paymentMethod: paymentMethod,
  //     };

  //     axios
  //       .post("/orders", data)
  //       .then((response) => {
  //         console.log(response.data);
  //         localStorage.removeItem("products");
  //         if (response.data.paymentMethod !== "COD") {
  //           displayRazorpay(
  //             name,
  //             email,
  //             phone,
  //             address1,
  //             totalPrice,
  //             response.data._id
  //           );
  //         } else {
  //           window.location.pathname = "/thankyou";
  //         }
  //       })
  //       .catch((error) => {
  //         message.error("Some error occured !");
  //         console.log(error);
  //       });
  //   }
  // };

  return (
    <div style={{ position: "relative" }}>
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <form id="donateForm"> </form>
        <Button width="30" onClick={() => displayRazorpay()}>
          Continue to payment
        </Button>
      </Modal>

      <S.WaitRoomImg src={WaitingRoom} />
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
