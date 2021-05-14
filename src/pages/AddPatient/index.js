import { Form, message, Space, Row, Spin } from "antd";
import * as S from "./styles";
import { useState } from "react";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import axios from "axios";
import Input from "../../common/Input";
import Button from "../../common/Button";

const { Option } = S.FormSelects;

const AddPatient = () => {
  const [islogin, setIslogin] = useState(false);
  const onFinish = (values) => {
    setIslogin(true);
    console.log("Received values of form:", values);

    const doctor = localStorage.getItem("docsrecordDoctor");
    values.doctor = doctor;
    axios
      .post("/patients", values)
      .then((response) => {
        setIslogin(false);
        console.log(response);
        message.success("Patient added successfully !").then(() => {
          window.location.pathname = "/records";
        });
      })
      .catch((err) => {
        setIslogin(false);
        console.log(err);
      });
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let login = <Button htmlType="submit">Add Patient Record</Button>;
  if (islogin === true) {
    login = <Spin indicator={antIcon} />;
  }

  return (
    <>
      <S.Container>
        <S.Heading>ADD PATIENT</S.Heading>

        <Form
          name="dynamic_form_nest_item"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Row align="middle">
            <S.InputCols lg={8} md={8} sm={24} xs={24}>
              <Form.Item name="name">
                <Input type="text" label="Name" />
              </Form.Item>
            </S.InputCols>
            <S.InputCols lg={8} md={8} sm={24} xs={24}>
              <Form.Item name="age">
                <Input type="number" label="Age" />
              </Form.Item>
            </S.InputCols>
            <S.InputCols lg={8} md={8} sm={24} xs={24}>
              <Form.Item name="gender">
                <S.FormSelects size="large" placeholder="Gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Others">Others</Option>
                </S.FormSelects>
              </Form.Item>
            </S.InputCols>
          </Row>

          <Row>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              <Form.Item name="phone_number">
                <Input type="number" label="Phone Number" />
              </Form.Item>
            </S.InputCols>

            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              <Form.Item name="email">
                <Input type="email" label="Email" />
              </Form.Item>
            </S.InputCols>
          </Row>

          <Row>
            <S.InputCols span={24}>
              <Form.Item name="address">
                <S.FormTextArea rows={4} placeholder="Address" />
              </Form.Item>
            </S.InputCols>
          </Row>

          <Row>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              <Form.List name="treatments">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "treatment"]}
                          fieldKey={[fieldKey, "treatment"]}
                          rules={[
                            { required: true, message: "Missing Treatment" },
                          ]}
                        >
                          <Input label="Treatment" type="text" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "charges"]}
                          fieldKey={[fieldKey, "charges"]}
                          rules={[
                            { required: true, message: "Missing Charges" },
                          ]}
                        >
                          <Input label="Charges" type="number" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item style={{ textAlign: "center" }}>
                      <Button onClick={() => add()}>
                        <PlusOutlined />
                        Add Treatment
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </S.InputCols>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              <Form.Item name="payment_method">
                <Input type="text" label="Payment Method" />
              </Form.Item>
            </S.InputCols>
          </Row>

          <Form.Item style={{ textAlign: "center" }}>{login}</Form.Item>
        </Form>
      </S.Container>
      <br />
      <br />
    </>
  );
};

export default AddPatient;
