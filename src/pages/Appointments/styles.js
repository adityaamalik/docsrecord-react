import styled from "styled-components";

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 100px 24px 32px;

  @media only screen and (max-width: 768px) {
    padding: 76px 12px 20px;
  }
`;

export const CardDiv = styled.div`
  margin: 8px;

  @media only screen and (max-width: 1400px) {
    margin: 4px;
  }

  @media only screen and (max-width: 768px) {
    marin: 4px;
  }
`;

export const Date = styled.span`
  margin-left: 10px;
  font-size: 20px;
`;

export const AppointmentCardContainer = styled.div`
  margin-top: 10px;
`;

export const Heading = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0 28px;
  @media only screen and (max-width: 768px) {
    font-size: 26px;
  }
`;
