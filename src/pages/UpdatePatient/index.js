import { Form, Space, Row } from "antd";
import { useState, useEffect } from "react";
import * as S from "./styles";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Input from "../../common/Input";

const { Option } = S.FormSelects;

const UpdatePatient = (props) => {
  const [patient, setPatient] = useState({});
  const { id } = props.location.state;

  useEffect(() => {
    if (!!id) {
      const token = localStorage.getItem("docsrecordJwtToken");
      axios
        .get(`http://localhost:3000/patients/${id}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPatient(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.location.pathname = "/records";
    }
  }, [id]);

  const onFinish = (values) => {
    console.log(values);
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

          {patient.treatments &&
            patient.treatments.map((treatment, index) => {
              return (
                <Row key={index}>
                  <S.InputCols lg={6} md={6} sm={12} xs={12}>
                    <Form.Item
                      name={`treatment${index}`}
                      initialValue={treatment.treatment}
                    >
                      <Input type="text" label="Treatment" />
                    </Form.Item>
                  </S.InputCols>
                  <S.InputCols lg={6} md={6} sm={12} xs={12}>
                    <Form.Item
                      name={`charge${index}`}
                      initialValue={treatment.charges}
                    >
                      <Input type="number" label="Charges" />
                    </Form.Item>
                  </S.InputCols>
                  <Form.Item name={`id${index}`} initialValue={treatment._id}>
                    <Input type="hidden" />
                  </Form.Item>
                </Row>
              );
            })}

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
                    <Form.Item>
                      <S.CustomButton
                        size="large"
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Treatment
                      </S.CustomButton>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </S.InputCols>
          </Row>

          <Form.Item>
            <S.CustomButton block size="large" htmlType="submit">
              Update Patient Record
            </S.CustomButton>
          </Form.Item>
        </Form>
      </S.Container>
      <br />
      <br />
    </>
  );
};

export default UpdatePatient;
