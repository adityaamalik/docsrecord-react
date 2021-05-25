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

export const CounterHeading3 = styled.span`
  font-size: 60px;
  @media only screen and (max-width: 768px) {
    margin: 10px;
    font-size: 40px;
  }
`;
