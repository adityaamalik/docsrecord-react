import styled from "styled-components";
import { Row, Card } from "antd";

export const Container = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    marin: 5px;
  }
`;

export const Date = styled.span`
  margin-left: 10px;
  font-size: 20px;
`;

export const CustomRow = styled(Row)`
  margin-top: 30px;
`;

export const AppointmentCard = styled(Card)`
  margin: 10px;
`;

export const AppointmentCardContainer = styled.div`
  margin-top: 10px;
`;
