import styled from "styled-components";

export const Heading = styled.span`
  font-size: 40px;
  @media only screen and (max-width: 1000px) {
    font-size: 20px;
  }
`;
export const WaitRoomImg = styled.img`
  position: absolute;
  opacity: 0.6;
  height: auto;
  width: 50%;
  right: 0;
  top: 20%;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;
export const SubHeading = styled.span`
  font-size: 20px;
  margin: 20px;
  @media only screen and (max-width: 1000px) {
    font-size: 20px;
    content: "\a";
    white-space: pre;
  }
`;
