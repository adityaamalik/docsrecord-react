import * as S from "./styles";
import { Row, Col } from "antd";
import Logo from "../../img/doc.png";
import { CaretRightOutlined } from "@ant-design/icons";

const Header = () => {
  return (
    <S.Header>
      <Row align="middle">
        <Col span={6}>
          <img src={Logo} alt="Logo" height="50px" width="50px" />
        </Col>
        <Col span={12}>
          <S.CustomNavLinkSmall>
            {window.location.pathname === "/records" && <CaretRightOutlined />}
            <S.Span href="/records">records</S.Span>
          </S.CustomNavLinkSmall>
          <S.CustomNavLinkSmall>
            {window.location.pathname === "/addpatient" && (
              <CaretRightOutlined />
            )}
            <S.Span href="/addpatient">add patient</S.Span>
          </S.CustomNavLinkSmall>
          <S.CustomNavLinkSmall>
            {window.location.pathname === "/appointments" && (
              <CaretRightOutlined />
            )}
            <S.Span href="/appointments">appointments</S.Span>
          </S.CustomNavLinkSmall>
          <S.CustomNavLinkSmall>
            {window.location.pathname === "/myprofile" && (
              <CaretRightOutlined />
            )}
            <S.Span href="/myprofile">my profile</S.Span>
          </S.CustomNavLinkSmall>
          <S.CustomNavLinkSmall>
            {window.location.pathname === "/logout" && <CaretRightOutlined />}
            <S.Span href="/logout">logout</S.Span>
          </S.CustomNavLinkSmall>
        </Col>
        <Col span={6}></Col>
      </Row>
    </S.Header>
  );
};

export default Header;
