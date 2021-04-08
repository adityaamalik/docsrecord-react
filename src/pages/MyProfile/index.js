import * as S from "./styles";
import { useState, useEffect } from "react";
import axios from "axios";

const MyProfile = () => {
  const [name, setName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/doctors/606ca88b2dec6205b877d58d", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N0b3JJZCI6IjYwNmNhODhiMmRlYzYyMDViODc3ZDU4ZCIsImlhdCI6MTYxNzg3NDg5OCwiZXhwIjoxNjE3OTYxMjk4fQ.bsMAqc6Quw5HeCooOElX5w4M0iYFfSrD2McNwKu061g`,
        },
      })
      .then((response) => {
        console.log(response);
        setName(response.data.name);
        setClinicName(response.data.clinic_name);
        setClinicAddress(response.data.clinic_address);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = () => {
    const data = {
      name: name,
      clinic_name: clinicName,
      clinic_address: clinicAddress,
    };

    axios
      .put("http://localhost:3000/doctors/606ca88b2dec6205b877d58d", data, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N0b3JJZCI6IjYwNmNhODhiMmRlYzYyMDViODc3ZDU4ZCIsImlhdCI6MTYxNzg3NDg5OCwiZXhwIjoxNjE3OTYxMjk4fQ.bsMAqc6Quw5HeCooOElX5w4M0iYFfSrD2McNwKu061g`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <S.Container>
        <S.Heading>MY PROFILE</S.Heading>

        <S.FormRows align="middle">
          <S.InputCols
            lg={6}
            md={6}
            sm={8}
            xs={8}
            style={{ textAlign: "center" }}
          >
            <S.Label>Name :</S.Label>
          </S.InputCols>
          <S.InputCols lg={14} md={14} sm={16} xs={16}>
            <S.InputBox
              type="text"
              bordered={false}
              size="large"
              placeholder="Enter New Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </S.InputCols>
          <S.InputCols lg={4} md={4} sm={0} xs={0}></S.InputCols>
        </S.FormRows>

        <S.FormRows align="middle">
          <S.InputCols
            lg={6}
            md={6}
            sm={8}
            xs={8}
            style={{ textAlign: "center" }}
          >
            <S.Label>Clinic Name :</S.Label>
          </S.InputCols>
          <S.InputCols lg={14} md={14} sm={16} xs={16}>
            <S.InputBox
              type="text"
              bordered={false}
              size="large"
              placeholder="Enter Clinic's New Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </S.InputCols>
          <S.InputCols lg={4} md={4} sm={0} xs={0}></S.InputCols>
        </S.FormRows>

        <S.FormRows align="middle">
          <S.InputCols
            lg={6}
            md={6}
            sm={8}
            xs={8}
            style={{ textAlign: "center" }}
          >
            <S.Label>Clinic Address :</S.Label>
          </S.InputCols>
          <S.InputCols lg={14} md={14} sm={16} xs={16}>
            <S.InputBox
              type="text"
              bordered={false}
              size="large"
              placeholder="Enter Clinic's New Address"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
            />
          </S.InputCols>
          <S.InputCols lg={4} md={4} sm={0} xs={0}></S.InputCols>
        </S.FormRows>

        <S.FormRows align="middle">
          <S.InputCols span={24} style={{ textAlign: "center" }}>
            <S.CustomButton size="large" onClick={onSubmit}>
              Save Profile Changes
            </S.CustomButton>
          </S.InputCols>
        </S.FormRows>
      </S.Container>
    </>
  );
};

export default MyProfile;
