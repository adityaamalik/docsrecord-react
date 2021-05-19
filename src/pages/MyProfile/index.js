import * as S from "./styles";
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { message, Avatar, Badge, Modal, Row, Col } from "antd";
import moment from "moment";
import {
  UserOutlined,
  EditOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const MyProfile = () => {
  const [docData, setDocData] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMonthlyModalVisible, setIsMonthlyModalVisible] = useState(false);
  const [isYearlyModalVisible, setIsYearlyModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [visitCharges, setVisitCharges] = useState("");
  const [image, setImage] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [showEdit, toggleEdit] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");
    axios
      .get(`/doctors/${doctor}`)
      .then((response) => {
        console.log(response.data);
        setDocData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const onSubmit = () => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");
    const data = new FormData();

    if (name !== "") {
      data.append("name", name);
    }

    if (clinicName !== "") {
      data.append("clinic_name", clinicName);
    }

    if (clinicAddress !== "") {
      data.append("clinic_address", clinicAddress);
      // data.clinic_address = clinicAddress;
    }

    if (phone !== "") {
      data.append("phone_number", phone);
      // data.phone_number = phone;
    }

    if (qualifications !== "") {
      data.append("qualifications", qualifications);
    }

    if (visitCharges !== "") {
      data.append("visit_charges", visitCharges);
      // data.visit_charges = visitCharges;
    }

    if (!!image) {
      data.append("image", image);
      console.log(image);
      // data.image.push(image);
    }
    axios
      .put(`/doctors/${doctor}`, data)
      .then((response) => {
        window.location.pathname = "/myprofile";
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        message.error("Some error occured");
      });
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
          doctorId: docData._id,
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          subscription: subscription,
        };

        const result = await axios.post("/payments/success", data);

        if (result) {
          message
            .success("Payment successful !")
            .then(() => (window.location.pathname = "/myprofile"));
        }
      },
      prefill: {
        name: docData.name,
        email: docData.email,
        contact: docData.phone_number,
      },
      notes: {
        address: docData.address,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
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

        <h1>Complete your payment</h1>
        <h3>
          Your plan is valid till :{" "}
          {moment(docData.payment_valid_till).format("MMMM Do YYYY")}
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
      <S.Container>
        <S.Heading>MY PROFILE</S.Heading>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          {" "}
          {isLoading ? (
            <LoadingOutlined style={{ fontSize: "50px" }} />
          ) : (
            <>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                {!!docData.image ? (
                  <span
                    onMouseEnter={() => toggleEdit(true)}
                    onMouseLeave={() => toggleEdit(false)}
                  >
                    <S.FileUploadLabel htmlFor="userImage">
                      <Badge count={showEdit ? <EditOutlined /> : <></>}>
                        <Avatar
                          src={`data:image/${
                            docData.image.contentType
                          };base64,${new Buffer.from(
                            docData.image.data
                          ).toString("base64")}`}
                          size={{
                            xs: 40,
                            sm: 40,
                            md: 64,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                          }}
                        />
                      </Badge>
                    </S.FileUploadLabel>
                    <S.FileUpload
                      type="file"
                      id="userImage"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <br />
                    <br />
                    <span>{image.name}</span>
                  </span>
                ) : (
                  <span
                    onMouseEnter={() => toggleEdit(true)}
                    onMouseLeave={() => toggleEdit(false)}
                  >
                    <S.FileUploadLabel htmlFor="userImage">
                      <Badge count={showEdit ? <EditOutlined /> : <></>}>
                        <Avatar
                          icon={<UserOutlined />}
                          size={{
                            xs: 40,
                            sm: 40,
                            md: 64,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                          }}
                        />
                      </Badge>
                    </S.FileUploadLabel>
                    <S.FileUpload
                      type="file"
                      id="userImage"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <br />
                    <br />
                    <span>{image.name}</span>
                  </span>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                Your next payment date is :{" "}
                {moment(docData.payment_valid_till).format("MMMM Do YYYY")}
                <br />
                <button
                  onClick={() => setIsModalVisible(true)}
                  style={{
                    backgroundColor: "white",
                    border: "none",
                    borderBottom: "1px solid black",
                    cursor: "pointer",
                  }}
                >
                  Pay now
                </button>
              </div>
            </>
          )}
        </div>

        <div>
          <S.FormRows align="middle">
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {!!docData.name && (
                <Input
                  type="text"
                  label="Edit name"
                  onChange={(val) => setName(val)}
                  defaultValue={docData.name}
                />
              )}
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {!!docData.phone_number && (
                <Input
                  type="text"
                  label="Edit Phone Number"
                  onChange={(val) => setPhone(val)}
                  defaultValue={docData.phone_number}
                />
              )}
            </S.InputCols>
          </S.FormRows>

          <S.FormRows align="middle">
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.clinic_name !== undefined &&
                docData.clinic_name !== null && (
                  <Input
                    type="text"
                    label="Edit clinic name"
                    defaultValue={docData.clinic_name}
                    onChange={(val) => setClinicName(val)}
                  />
                )}
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.clinic_address !== undefined &&
                docData.clinic_address !== null && (
                  <Input
                    type="text"
                    label="Edit clinic's address"
                    defaultValue={docData.clinic_address}
                    onChange={(val) => setClinicAddress(val)}
                  />
                )}
            </S.InputCols>
          </S.FormRows>

          <S.FormRows align="middle">
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.qualifications !== undefined &&
                docData.qualifications !== null && (
                  <Input
                    type="text"
                    label="Edit qualifications"
                    defaultValue={docData.qualifications}
                    onChange={(val) => setQualifications(val)}
                  />
                )}
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              {docData.visit_charges !== undefined &&
                docData.visit_charges !== null && (
                  <Input
                    type="number"
                    label="Edit visit charges"
                    defaultValue={docData.visit_charges}
                    onChange={(val) => setVisitCharges(val)}
                  />
                )}
            </S.InputCols>
          </S.FormRows>

          <S.FormRows align="middle">
            <S.InputCols span={24} style={{ textAlign: "center" }}>
              <Button disabled={isLoading} onClick={onSubmit}>
                Save Profile Changes
              </Button>
            </S.InputCols>
          </S.FormRows>

          <br />
          <br />
          <br />
        </div>
      </S.Container>
    </>
  );
};

export default MyProfile;
