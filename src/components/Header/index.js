import * as S from "./styles";
import { Row, Col, Menu, Dropdown } from "antd";
import Logo from "../../img/doc.png";
import { CaretRightOutlined } from "@ant-design/icons";

const menu = () => {
  return (
    <Menu>
      <Menu.Item key="0">
        <S.Span to="/records">
          {window.location.pathname === "/records" && <CaretRightOutlined />}
          records
        </S.Span>
      </Menu.Item>
      <Menu.Item key="1">
        <S.Span to="/addpatient">
          {window.location.pathname === "/addpatient" && <CaretRightOutlined />}
          add patient
        </S.Span>
      </Menu.Item>
      <Menu.Item key="3">
        <S.Span to="/appointments">
          {window.location.pathname === "/appointments" && (
            <CaretRightOutlined />
          )}
          appointments
        </S.Span>
      </Menu.Item>
      <Menu.Item key="4">
        <S.Span to="/myprofile">
          {window.location.pathname === "/myprofile" && <CaretRightOutlined />}
          my profile
        </S.Span>
      </Menu.Item>
      <Menu.Item key="5">
        <S.Span to="/statistics">
          {window.location.pathname === "/statistics" && <CaretRightOutlined />}
          statistics
        </S.Span>
      </Menu.Item>
      <Menu.Item key="6">
        <S.Span
          to="/#"
          onClick={() => {
            localStorage.clear();
            window.location.pathname = "/";
          }}
        >
          logout
        </S.Span>
      </Menu.Item>
    </Menu>
  );
};

const Header = () => {
  return (
    <S.Header>
      <Row align="middle">
        <Col span={6}>
          <S.Logo src={Logo} alt="Logo" />
        </Col>
        <Col span={12}>
          <S.Heading to="/records">DOCSRECORD</S.Heading>
        </Col>
        <Col span={6}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              href="/#"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <S.DropdownIcon className="lni-menu" />
            </a>
          </Dropdown>
        </Col>
      </Row>
    </S.Header>
  );
};

export default Header;
