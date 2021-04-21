import styled from "styled-components";

export const Container = styled.div`
  margin: 100px;
  @media only screen and (max-width: 768px) {
    margin: 50px;
  }
`;

export const Logo = styled.img`
  height: 150px;
  width: 150px;
  @media only screen and (max-width: 768px) {
    height: 100px;
    width: 100px;
  }
`;

export const PatientInfo = styled.div`
  border: 1px solid black;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const TreatmentContainer = styled.div`
  border: 1px solid black;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`;
