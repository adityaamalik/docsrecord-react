import styled from "styled-components";

export const Container = styled.div`
  margin: 100px;
  @media only screen and (max-width: 768px) {
    margin: 50px;
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
