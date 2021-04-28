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
  margin-top: 50px;
  @media only screen and (max-width: 768px) {
    marin-top: 50px;
  }
`;

export const InputCols = styled(Col)`
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    margin-top: 5px;
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

export const FormRows = styled(Row)``;

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

export const FileUpload = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
`;

export const FileUploadLabel = styled.label`
  cursor: pointer;
`;
