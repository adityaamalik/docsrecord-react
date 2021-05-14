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
`;
export const Picker = styled.div`
  display: flex;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
export const PickerM = styled.div`
  display: none;
  @media only screen and (max-width: 768px) {
    display: flex;
  }
`;
