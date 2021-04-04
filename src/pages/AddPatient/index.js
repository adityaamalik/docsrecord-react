import { Form, Space, Select } from "antd";
import { useState, useEffect } from "react";
import * as S from "./styles";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddPatient = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [treatmentList, setTreatmentList] = useState([]);

  useEffect(() => {
    console.log(paymentMethod);
  });

  return (
    <>
      <S.Container>
        <S.Heading>ADD PATIENT</S.Heading>
        <S.FormRows>
          <S.InputCols lg={7} md={7} sm={24} xs={24}>
            <S.InputBox
              size="large"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              bordered={false}
            />
          </S.InputCols>
          <S.InputCols lg={1} md={1} sm={24} xs={24}></S.InputCols>
          <S.InputCols lg={7} md={7} sm={24} xs={24}>
            <S.InputBox
              size="large"
              type="number"
              placeholder="Age"
              onChange={(e) => setAge(e.target.value)}
              value={age}
              bordered={false}
            />
          </S.InputCols>
          <S.InputCols lg={1} md={1} sm={24} xs={24}></S.InputCols>
          <S.InputCols lg={7} md={7} sm={24} xs={24}>
            <S.InputBox
              size="large"
              type="text"
              placeholder="Gender"
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              bordered={false}
            />
          </S.InputCols>
        </S.FormRows>

        <S.FormRows>
          <S.InputCols lg={11} md={11} sm={24} xs={24}>
            <S.InputBox
              size="large"
              type="number"
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              bordered={false}
            />
          </S.InputCols>
          <S.InputCols lg={1} md={2} sm={24} xs={24}></S.InputCols>

          <S.InputCols lg={11} md={10} sm={24} xs={24}>
            <S.InputBox
              size="large"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              bordered={false}
            />
          </S.InputCols>
        </S.FormRows>

        <S.FormRows>
          <S.InputCols span={23}>
            <S.FormTextArea
              rows={4}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </S.InputCols>
        </S.FormRows>

        <S.FormRows>
          <S.InputCols lg={11} md={11} sm={24} xs={24}>
            <Form name="dynamic_form_nest_item" autoComplete="off">
              <Form.List name="users">
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
                          <S.InputBox
                            placeholder="Treatment"
                            type="text"
                            bordered={false}
                            size="large"
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "charges"]}
                          fieldKey={[fieldKey, "charges"]}
                          rules={[
                            { required: true, message: "Missing Charges" },
                          ]}
                        >
                          <S.InputBox
                            placeholder="Charges"
                            type="number"
                            bordered={false}
                            size="large"
                          />
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
            </Form>
          </S.InputCols>
          <S.InputCols lg={1} md={2} sm={24} xs={24}></S.InputCols>
          <S.InputCols lg={11} md={11} sm={24} xs={24}>
            <Select
              size="large"
              placeholder="Payment Method"
              style={{ width: "100%" }}
              onChange={(value) => setPaymentMethod(value)}
            >
              <Option value="Cash">Cash</Option>
              <Option value="UPI">UPI</Option>
              <Option value="Debit Card">Debit Card</Option>
              <Option value="Credit Card">Credit Card</Option>
            </Select>
          </S.InputCols>
        </S.FormRows>

        <S.FormRows>
          <S.InputCols span={23}>
            <S.CustomButton block size="large">
              Add Patient Record
            </S.CustomButton>
          </S.InputCols>
        </S.FormRows>
      </S.Container>
      <br />
      <br />
    </>
  );
};

export default AddPatient;
