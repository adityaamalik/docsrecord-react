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

export const TopContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const UnderlinedSpan = styled.span`
  padding-bottom: 5px;
`;

export const EmptyDiv = styled.div`
  height: 500px;
`;

export const Prescription = styled.div`
  min-height: 420px;
  margin-top: 30px;

  p {
    color: #000 !important;
  }
`;

export const Rx = styled.div`
  margin: 16px 0 8px;
  font-size: 34px;
  font-weight: 700;
`;

export const MedicineTable = styled.table`
  width: 100%;
  margin-bottom: 24px;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    border: 1px solid #999;
    text-align: left;
  }
`;
