import * as S from "./styles";
import { Row, Col, Menu, Dropdown } from "antd";
import Logo from "../../img/doc.png";
import { CaretRightOutlined } from "@ant-design/icons";

const menu = (
  <Menu>
    <Menu.Item key="0">
      <S.Span href="/records">
        {window.location.pathname === "/records" && <CaretRightOutlined />}
        records
      </S.Span>
    </Menu.Item>
    <Menu.Item key="1">
      <S.Span href="/addpatient">
        {window.location.pathname === "/addpatient" && <CaretRightOutlined />}
        add patient
      </S.Span>
    </Menu.Item>
    <Menu.Item key="3">
      <S.Span href="/appointments">
        {window.location.pathname === "/appointments" && <CaretRightOutlined />}
        appointments
      </S.Span>
    </Menu.Item>
    <Menu.Item key="4">
      <S.Span href="/myprofile">
        {window.location.pathname === "/myprofile" && <CaretRightOutlined />}my
        profile
      </S.Span>
    </Menu.Item>
    <Menu.Item key="5">
      <S.Span href="/statistics">
        {window.location.pathname === "/statistics" && <CaretRightOutlined />}
        statistics
      </S.Span>
    </Menu.Item>
    <Menu.Item key="6">
      <S.Span href="/logout">
        {window.location.pathname === "/logout" && <CaretRightOutlined />}
        logout
      </S.Span>
    </Menu.Item>
  </Menu>
);

const Header = () => {
  return (
    <S.Header>
      <Row align="middle">
        <Col span={6}>
          <S.Logo src={Logo} alt="Logo" />
        </Col>
        <Col span={12}>
          <S.Heading href="/records">DOCSRECORD</S.Heading>
        </Col>
        <Col span={6}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              href="/#"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <S.DropdownIcon />
            </a>
          </Dropdown>
        </Col>
      </Row>
    </S.Header>
  );
};

export default Header;
