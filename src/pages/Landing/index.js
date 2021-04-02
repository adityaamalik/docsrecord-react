import * as S from "./styles";
import ImageUrl from "../../img/doc.png";

const Landing = () => {
  return (
    <>
      <S.MainRow align="middle" justify="center">
        <S.MainCol lg={12} md={24} sm={24}>
          <S.Image src={ImageUrl} />
          <br />
          <S.Heading>DOCSRECORD</S.Heading>
        </S.MainCol>
        <S.MainCol lg={12} md={24} sm={24}>
          <S.SubHeading>
            WE HELP YOU KEEP YOUR PATIENT RECORDS SAFE.
          </S.SubHeading>
        </S.MainCol>
      </S.MainRow>
    </>
  );
};

export default Landing;
