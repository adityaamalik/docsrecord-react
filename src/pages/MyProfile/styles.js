import styled from "styled-components";
import { Row, Col, Input, Button } from "antd";

export const Container = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    marin: 5px;
  }
`;

export const Heading = styled.h1`
  text-align: center;
  margin-top: 100px;
  @media only screen and (max-width: 768px) {
    marin-top: 50px;
  }
`;

export const InputCols = styled(Col)`
  margin-top: 50px;
  @media only screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

export const InputBox = styled(Input)`
  border-bottom: 2px solid gray;
  &:focus {
    border-bottom: 2px solid black;
  }

  &:hover {
    border-bottom: 2px solid black;
  }
`;

export const FormRows = styled(Row)`
  margin-top: 30px;
`;

export const CustomButton = styled(Button)`
  color: black;
  border-color: black;
  &:hover {
    color: black;
    border-color: black;
  }
`;

export const Label = styled.span`
  font-size: 30px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;
