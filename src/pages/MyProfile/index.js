import * as S from "./styles";

const MyProfile = () => {
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
              defaultValue="Your Name"
              placeholder="Enter New Name"
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
              defaultValue="Clinic Name"
              placeholder="Enter Clinic's New Name"
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
              defaultValue="Clinic Address"
              placeholder="Enter Clinic's New Address"
            />
          </S.InputCols>
          <S.InputCols lg={4} md={4} sm={0} xs={0}></S.InputCols>
        </S.FormRows>

        <S.FormRows align="middle">
          <S.InputCols span={24} style={{ textAlign: "center" }}>
            <S.CustomButton size="large">Save Profile Changes</S.CustomButton>
          </S.InputCols>
        </S.FormRows>
      </S.Container>
    </>
  );
};

export default MyProfile;
