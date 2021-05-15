import { Col, Row } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  margin-top: 50px;
`;

export const ExpandableContainer = styled.div`
  margin: 10px;

  @media only screen and (max-width: 1400px) {
    margin: 0px;
  }

  @media only screen and (max-width: 768px) {
    marin: 0px;
  }
`;

export const ExpandableRow = styled(Row)`
  margin-top: 5px;
`;

export const ExpandableCol = styled(Col)`
  font-size: 15px;
  width: 100%;
`;

export const Label = styled.span`
  font-weight: 900;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
    margin-left: 5px;
  }
`;

export const RightLabel = styled.span`
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Picker = styled.div`
  display: flex;
`;

export const FileUpload = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
  width: 25%;
`;

export const FileUploadLabel = styled.label`
  cursor: pointer;
`;
