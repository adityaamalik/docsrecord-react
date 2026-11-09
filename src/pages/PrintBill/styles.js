import styled from "styled-components";

export const Container = styled.div`
  margin: 100px;
  padding: 40px;
  background: #fff;
  border-radius: 28px;
  box-shadow: var(--glass-shadow);
  @media only screen and (max-width: 768px) {
    margin: 20px;
    padding: 24px;
  }
  @media print {
    margin: 100px;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
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
