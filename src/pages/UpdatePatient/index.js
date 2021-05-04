import { Form, Space, Row, message } from "antd";
import { useState, useEffect } from "react";
import * as S from "./styles";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Input from "../../common/Input";
import Button from "../../common/Button";

const { Option } = S.FormSelects;

const UpdatePatient = (props) => {
  const [patient, setPatient] = useState({});
  const { id } = props.location.state;

  useEffect(() => {
    if (!!id) {
      axios
        .get(`/patients/${id}`)
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
    const treatmentsArr = [];

    for (const [key, value] of Object.entries(values)) {
      if (
        key !== "name" &&
        key !== "phone_number" &&
        key !== "address" &&
        key !== "email" &&
        key !== "payment_method" &&
        key !== "treatments" &&
        key !== "age" &&
        key !== "gender"
      )
        if (!!values.treatments) {
          treatmentsArr.push(value);
        }
    }

    for (let i = 0; i < treatmentsArr.length - 1; i = i + 2) {
      const temp = {
        treatment: treatmentsArr[i],
        charges: treatmentsArr[i + 1],
      };

      values.treatments.push(temp);
    }

    const doctor = localStorage.getItem("docsrecordDoctor");
    values.doctor = doctor;
    axios
      .put(`/patients/${id}`, values)
      .then((response) => {
        console.log(response);
        setPatient(response.data);
        message.success("Patient updated successfully !").then(() => {
          // window.location.pathname = "/records";
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTreatment = (treatment) => {
    console.log("clicked");

    let treatmentss = patient.treatments.filter((t) => {
      return (
        t.treatment !== treatment.treatment && t.charges !== treatment.charges
      );
    });
    patient.treatments = [...treatmentss];
    console.log(patient.treatments);
    setPatient({ ...patient });
    console.log(patient);
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
          {patient.treatments &&
            patient.treatments.map((treatment, index) => {
              return (
                <Row key={treatment.treatment + index} align="middle">
                  <S.InputCols lg={6} md={6} sm={12} xs={12}>
                    <Form.Item
                      name={`treatment${treatment.treatment + index}`}
                      initialValue={treatment.treatment}
                    >
                      <Input type="text" label="Treatment" />
                    </Form.Item>
                  </S.InputCols>
                  <S.InputCols lg={6} md={6} sm={11} xs={11}>
                    <Form.Item
                      name={`charge${treatment.treatment + index}`}
                      initialValue={treatment.charges}
                    >
                      <Input type="number" label="Charges" />
                    </Form.Item>
                  </S.InputCols>
                  <S.InputCols span={1}>
                    <MinusCircleOutlined
                      style={{ marginBottom: "30px" }}
                      onClick={() => deleteTreatment(treatment)}
                    />
                  </S.InputCols>
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
                      <Button onClick={() => add()}>
                        <PlusOutlined /> Add Treatment
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </S.InputCols>
          </Row>

          <Form.Item style={{ textAlign: "center" }}>
            <Button htmlType="submit">Update Patient Record</Button>
          </Form.Item>
        </Form>
      </S.Container>
      <br />
      <br />
    </>
  );
};

export default UpdatePatient;
