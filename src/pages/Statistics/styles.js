import styled from "styled-components";
import { Row, Col } from "antd";

export const Container = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    marin: 5px;
  }
`;
export const GraphC = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const CounterContainer = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    marin: 5px;
  }
`;

export const CounterRow = styled(Row)`
  text-align: center;
`;

export const CounterCol = styled(Col)`
  font-size: 80px;

  @media only screen and (max-width: 768px) {
    font-size: 30px;
  }
`;

export const CounterHeading = styled.span`
  font-size: 40px;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`;
