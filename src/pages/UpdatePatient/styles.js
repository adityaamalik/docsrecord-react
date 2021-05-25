import styled from "styled-components";

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

export const SubHeading = styled.p`
  margin-top: 40px;
  font-size: 20px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;
