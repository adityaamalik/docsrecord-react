import { Form, Space, Row, message, Spin } from "antd";
import { useState, useEffect } from "react";
import * as S from "./styles";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Input from "../../common/Input";
// import Button from "../../common/Button";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const { Option } = S.FormSelects;

const UpdatePatient = (props) => {
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [treatments, setTreatments] = useState([]);
  const [charges, setCharges] = useState([]);

  const [numberOfTreatments, setNumberOfTreatments] = useState([]);

  const [islogin, setIslogin] = useState(false);

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

  const onFinish = () => {
    setIsLoading(true);

    const doctor = localStorage.getItem("docsrecordDoctor");

    const data = new FormData();
    data.append("doctor", doctor);
    if (name !== "") {
      data.append("name", name);
    }

    if (age !== "") {
      data.append("age", age);
    }

    if (gender !== "") {
      data.append("gender", gender);
    }

    if (phone !== "") {
      data.append("phone_number", phone);
    }

    if (email !== "") {
      data.append("email", email);
    }

    if (address !== "") {
      data.append("address", address);
    }
    if (paymentMethod !== "") {
      data.append("payment_method", paymentMethod);
    }
    if (charges !== "") {
      data.append("total_cost", charges);
    }
    if (numberOfTreatments !== "") {
      data.append("total_treatments", numberOfTreatments);
    }
    if (treatments) data.append("treatments", treatments);
    axios
      .put(`/patients/${id}`, data)
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
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let login = (
    <Button variant="outlined" onClick={onFinish}>
      Update Patient
    </Button>
  );
  if (islogin === true) {
    login = <Spin indicator={antIcon} />;
  }
  return (
    <>
      <S.Container>
        <S.Heading>Update PATIENT</S.Heading>

        <div className="classes.root">
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={4} md={4} sm={12} xs={12}>
              {patient.name !== undefined && patient.name !== null && (
                <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <TextField
                    label="Name"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={patient.name}
                  />
                </form>
              )}
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              {patient.age !== undefined && patient.age !== null && (
                <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <TextField
                    label="Age"
                    variant="outlined"
                    onChange={(e) => setAge(e.target.value)}
                    defaultValue={patient.age}
                  />
                </form>
              )}
            </Grid>

            <Grid item lg={4} md={4} sm={12} xs={12}>
              {patient.gender !== undefined && patient.gender !== null && (
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  onSubmit={(event) => event.preventDefault()}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    defaultValue={patient.gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Age"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {patient.phone_number !== undefined &&
                patient.phone_number !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      label="Phone Number"
                      variant="outlined"
                      onChange={(e) => setPhone(e.target.value)}
                      defaultValue={patient.phone_number}
                    />
                  </form>
                )}
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              {patient.email !== undefined && patient.email !== null && (
                <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <TextField
                    label="Email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                    defaultValue={patient.email}
                  />
                </form>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12}>
              {patient.address !== undefined && patient.address !== null && (
                <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <TextField
                    id="outlined-multiline-static"
                    label="Address"
                    multiline
                    rows={4}
                    defaultValue={patient.address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                  />
                </form>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {numberOfTreatments.map((id, index) => (
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={3}
                  key={index}
                >
                  <Grid item xs={5}>
                    <form
                      className={classes.root}
                      noValidate
                      autoComplete="off"
                      onSubmit={(event) => event.preventDefault()}
                    >
                      <TextField
                        label="Treatment"
                        variant="outlined"
                        onChangeText={(text) => {
                          const temp = treatments;
                          temp[
                            numberOfTreatments[numberOfTreatments.length - 1]
                          ] = text;

                          setTreatments(temp);
                        }}
                      />
                    </form>
                  </Grid>
                  <Grid item xs={5}>
                    <form
                      className={classes.root}
                      noValidate
                      autoComplete="off"
                      onSubmit={(event) => event.preventDefault()}
                    >
                      <TextField
                        label="Charges"
                        variant="outlined"
                        onChangeText={(text) => {
                          const temp = charges;
                          temp[
                            numberOfTreatments[numberOfTreatments.length - 1]
                          ] = text;

                          setCharges(temp);
                        }}
                      />
                    </form>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      onClick={() => {
                        setNumberOfTreatments(
                          numberOfTreatments.filter((t) => {
                            return t !== id;
                          })
                        );
                      }}
                    >
                      -
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                onClick={() => {
                  setNumberOfTreatments([
                    ...numberOfTreatments,
                    numberOfTreatments.length,
                  ]);
                }}
                variant="outlined"
              >
                + Add Treatment
              </Button>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {patient.payment_method !== undefined &&
                patient.payment_method !== null && (
                  <form
                    className={classes.root}
                    noValidate
                    autoComplete="off"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <TextField
                      label="Payment Method"
                      variant="outlined"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      defaultValue={patient.payment_method}
                    />
                  </form>
                )}
            </Grid>
          </Grid>

          <div style={{ textAlign: "center" }}>{login}</div>
        </div>
      </S.Container>
      {/* <S.Container>
        <S.Heading>UPDATE PATIENT</S.Heading>

        <Form
          name="dynamic_form_nest_item"
          autoComplete="off"
          onFinish={onFinish}
        >
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

          <Row>
            <S.InputCols span={24}>
              <Form.Item name="address" initialValue={patient.address}>
                <S.FormTextArea rows={4} placeholder="Address" />
              </Form.Item>
            </S.InputCols>
          </Row>

          <Row>
            <S.InputCols lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="payment_method"
                initialValue={patient.payment_method}
              >
                <Input type="text" label="Payment Method" />
              </Form.Item>
            </S.InputCols>
          </Row>

          <Row>
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
          </Row>

          <Form.Item style={{ textAlign: "center" }}>
            <Button disabled={isLoading} htmlType="submit">
              Update Patient Record
            </Button>
          </Form.Item>
        </Form>
      </S.Container> */}
      <br />
      <br />
    </>
  );
};

export default UpdatePatient;
