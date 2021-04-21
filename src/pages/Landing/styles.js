import styled from "styled-components";
import { Row, Col } from "antd";

export const MainRow = styled(Row)`
  height: 100vh;
`;

export const MainCol = styled(Col)`
  text-align: center;
  @media only screen and (max-width: 1000px) {
    height: 100vh;
    padding-top: 180px;
  }
`;

export const Heading = styled.span`
  font-size: 5vw;
`;

export const SubHeading = styled.span`
  font-size: 20px;
  @media only screen and (max-width: 1000px) {
    font-size: 10px;
  }
`;

export const Image = styled.img`
  height: 150px;
  width: 150px;
  margin-bottom: 20px;
`;
