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
export const Graphmobile = styled.div`
  display: none;

  @media only screen and (max-width: 1400px) {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    display: inline;
  }
`;
export const Graphpc = styled.div`
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

export const CounterHeading2 = styled.span`
  font-size: 80px;
  @media only screen and (max-width: 768px) {
    font-size: 30px;
  }
`;
