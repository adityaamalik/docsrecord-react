import { Form, message, Row, Spin, Col } from "antd";
import * as S from "./styles";
import { useState } from "react";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import axios from "axios";
import Input from "../../common/Input";
import Button from "../../common/Button";

const { Option } = S.FormSelects;

const AddPatient = () => {
  const history = useHistory();

  const [islogin, setIslogin] = useState(false);
  const onFinish = (values) => {
    setIslogin(true);

    axios
      .post("https://docsrecord.herokuapp.com/patient", values, {
        withCredentials: true,
      })
      .then((response) => {
        setIslogin(false);
        message.success("Patient added successfully !", 1).then(() => {
          history.push("/records");
        });
      })
      .catch((err) => {
        setIslogin(false);
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !", 1)
            .then(() => (window.location.pathname = "/"));
        }
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
                <S.FormSelects
                  size="large"
                  placeholder="Gender"
                  style={{ width: "95%" }}
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Others">Others</Option>
                </S.FormSelects>
              </Form.Item>
            </S.InputCols>
          </Row>

          <Row justify="center" align="middle">
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
            <S.InputCols span={24} style={{ textAlign: "center" }}>
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
                      <Row key={key} justify="center" align="middle">
                        <Col lg={10} md={11} sm={11} xs={11}>
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
                        </Col>
                        <Col lg={10} md={11} sm={11} xs={11}>
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
                        </Col>
                        <Col lg={4} md={2} sm={2} xs={2}>
                          <MinusCircleOutlined
                            style={{ paddingBottom: "30px" }}
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
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
