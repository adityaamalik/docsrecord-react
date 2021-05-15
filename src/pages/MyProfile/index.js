import * as S from "./styles";
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { message, Avatar, Badge } from "antd";
import { UserOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";

const MyProfile = () => {
  const [docData, setDocData] = useState({});

  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [visitCharges, setVisitCharges] = useState("");
  const [image, setImage] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [showEdit, toggleEdit] = useState(false);
  useEffect(() => {
    setIsLoadingData(true);
    const doctor = localStorage.getItem("docsrecordDoctor");
    axios
      .get(`/doctors/${doctor}`)
      .then((response) => {
        console.log(response.data);
        setDocData(response.data);
        setIsLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingData(false);
      });
  }, []);

  const onSubmit = () => {
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
        console.log(err);
        message.error("Some error occured");
      });
  };

  return (
    <>
      <S.Container>
        <S.Heading>MY PROFILE</S.Heading>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          {" "}
          {isLoadingData && <LoadingOutlined style={{ fontSize: "50px" }} />}
        </div>

        <div>
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
                      };base64,${new Buffer.from(docData.image.data).toString(
                        "base64"
                      )}`}
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
              <Button onClick={onSubmit}>Save Profile Changes</Button>
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
