import styled from "styled-components";
import { Row, Col, Input, Select, InputNumber } from "antd";
const { TextArea } = Input;

export const Container = styled.div`
  margin: 150px;

  @media only screen and (max-width: 1400px) {
    margin: 60px;
  }

  @media only screen and (max-width: 768px) {
    margin: 20px;
  }
`;

export const Heading = styled.h1`
  text-align: center;
  margin-top: 50px;
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
  border-bottom: 2px solid #eee;
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
  border: 1px solid black;

  &:focus {
    border: 1px solid black;
  }

  &:hover {
    border: 1px solid black;
  }
`;

export const SubHeading = styled.p`
  margin-top: 40px;
  font-size: 20px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

export const FormSelects = styled(Select)`
  width: 100%;
  border: 1px solid black;
`;

export const NumberInput = styled(InputNumber)`
  width: 100%;
  border-bottom: 2px solid #eee;
  &:focus {
    border-bottom: 2px solid black;
  }

  &:hover {
    border-bottom: 2px solid black;
  }
`;
