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
