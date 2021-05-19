import { Form, Space, Row, message } from "antd";
import { useState, useEffect } from "react";
import * as S from "./styles";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { useHistory } from "react-router-dom";

const { Option } = S.FormSelects;

const UpdatePatient = (props) => {
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = props.location.state;

  useEffect(() => {
    setIsLoading(true);
    if (!!id) {
      axios
        .get(`/patients/${id}`)
        .then((response) => {
          setPatient(response.data);
          console.log(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      history.push("/records");
    }
  }, [id, history]);

  const onFinish = (values) => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");
    values.doctor = doctor;
    axios
      .put(`/patients/${id}`, values)
      .then((response) => {
        console.log(response);
        setPatient(response.data);
        message.success("Patient updated successfully !").then(() => {
          setIsLoading(false);
          history.push("/records");
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <S.Container>
        <S.Heading>UPDATE PATIENT</S.Heading>

        <Form
          name="dynamic_form_nest_item"
          autoComplete="off"
          onFinish={onFinish}
        >
          {patient.name && patient.age && patient.gender && (
            <Row align="middle">
              <S.InputCols lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="name" initialValue={patient.name}>
                  <Input type="text" label="Name" />
                </Form.Item>
              </S.InputCols>
              <S.InputCols lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="age" initialValue={patient.age}>
                  <Input type="number" label="Age" />
                </Form.Item>
              </S.InputCols>
              <S.InputCols lg={8} md={8} sm={24} xs={24}>
                <Form.Item name="gender" initialValue={patient.gender}>
                  <S.FormSelects
                    size="large"
                    placeholder="Gender"
                    style={{ width: "100%" }}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Others">Others</Option>
                  </S.FormSelects>
                </Form.Item>
              </S.InputCols>
            </Row>
          )}

          {patient.phone_number && patient.email && (
            <Row>
              <S.InputCols lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="phone_number"
                  initialValue={patient.phone_number}
                >
                  <Input type="number" label="Phone Number" />
                </Form.Item>
              </S.InputCols>

              <S.InputCols lg={12} md={12} sm={24} xs={24}>
                <Form.Item name="email" initialValue={patient.email}>
                  <Input type="email" label="Email" />
                </Form.Item>
              </S.InputCols>
            </Row>
          )}

          {patient.address && (
            <Row>
              <S.InputCols span={24}>
                <Form.Item name="address" initialValue={patient.address}>
                  <S.FormTextArea rows={4} placeholder="Address" />
                </Form.Item>
              </S.InputCols>
            </Row>
          )}

          <Row>
            {patient.payment_method && (
              <S.InputCols lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="payment_method"
                  initialValue={patient.payment_method}
                >
                  <Input type="text" label="Payment Method" />
                </Form.Item>
              </S.InputCols>
            )}
          </Row>

          <Row>
            {patient.treatments && (
              <S.InputCols lg={12} md={12} sm={24} xs={24}>
                <Form.List name="treatments" initialValue={patient.treatments}>
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
                              {
                                required: true,
                                message: "Please fill treatment",
                              },
                            ]}
                          >
                            <Input label="Treatment" type="text" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "charges"]}
                            fieldKey={[fieldKey, "charges"]}
                            rules={[
                              {
                                required: true,
                                message: "Please fill charges",
                              },
                            ]}
                          >
                            <Input label="Charges" type="number" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button onClick={() => add()}>
                          <PlusOutlined /> Add Treatment
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </S.InputCols>
            )}
          </Row>

          <Form.Item style={{ textAlign: "center" }}>
            <Button disabled={isLoading} htmlType="submit">
              Update Patient Record
            </Button>
          </Form.Item>
        </Form>
      </S.Container>
      <br />
      <br />
    </>
  );
};

export default UpdatePatient;
