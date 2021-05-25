import styled from "styled-components";

export const Container = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }

  @media only screen and (max-width: 768px) {
    marin: 5px;
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
  margin-top: 100px;
  margin-bottom: 50px;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
    marin-top: 50px;
  }
`;
