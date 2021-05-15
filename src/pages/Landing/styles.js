import styled from "styled-components";
import { Row, Col } from "antd";
import WaitingRoom from "../../img/waitingroom.png";

export const MainRow = styled(Row)`
  height: 100vh;
  @media only screen and (max-width: 1000px) {
    padding-top: auto;
    algin: center;
  }
  background-image: url(${WaitingRoom});
  background-repeat: no-repeat;
`;

export const MainCol = styled(Col)`
  text-align: center;
  @media only screen and (max-width: 1000px) {
    height: auto;
    padding-top: 20px;
  }
`;

export const Heading = styled.span`
  font-size: 50px;
  @media only screen and (max-width: 1000px) {
    font-size: 30px;
  }
`;

export const SubHeading = styled.span`
  font-size: 20px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
  }
`;

export const Image = styled.img`
  height: 150px;
  width: 150px;
  margin-bottom: 20px;
  @media only screen and (max-width: 1000px) {
    height: 10vh;
    width: 10vh;
  }
`;
export const WaitRoomImg = styled.img`
  position: absolute;
  opacity: 0.4;
  height: 100vh;
  width: auto;
  left: 0;
  top: 0;
  @media only screen and (max-width: 1000px) {
    height: 100%;
  }
`;
