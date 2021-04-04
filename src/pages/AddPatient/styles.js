import styled from "styled-components";
import { Row, Col, Input, Button, Select } from "antd";
const { TextArea } = Input;

export const Container = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    marin: 5px;
  }
`;

export const Heading = styled.span`
  font-size: 30px;
  border-bottom: 2px solid gray;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
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

export const FormTextArea = styled(TextArea)`
  border: 2px solid gray;

  &:focus {
    border-color: black;
    border: 2px solid black;
  }

  &:hover {
    border-color: black;
    border: 2px solid black;
  }
`;

export const SubHeading = styled.p`
  margin-top: 40px;
  font-size: 20px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

export const CustomButton = styled(Button)`
  color: black;
  border-color: black;
  &:hover {
    color: black;
    border-color: black;
  }
`;

export const FormSelects = styled(Select)`
  width: 100%;
  border: 2px solid gray;
`;
