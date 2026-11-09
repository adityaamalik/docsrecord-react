import styled from "styled-components";

export const StatsPanel = styled.div.attrs({ className: "glass-panel" })`
  max-width: 1160px;
  margin: 100px auto 20px;
  padding: 32px;

  @media only screen and (max-width: 1200px) {
    margin: 96px 20px 20px;
  }

  @media only screen and (max-width: 768px) {
    margin: 76px 12px 14px;
    padding: 20px 12px;
  }
`;

export const Graphmobile = styled.div.attrs({ className: "glass-panel" })`
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
    margin: 14px 12px;
    padding: 18px 14px;
  }
`;

export const Graphpc = styled.div.attrs({ className: "glass-panel" })`
  max-width: 1160px;
  margin: 20px auto;
  padding: 28px 32px;

  @media only screen and (max-width: 1200px) {
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
  font-size: 20px;
  font-weight: 600;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

export const CounterHeading2 = styled.span`
  font-size: 60px;
  font-weight: 700;
  letter-spacing: -0.03em;
  @media only screen and (max-width: 768px) {
    font-size: 34px;
  }
`;

export const CounterHeading3 = styled.span`
  font-size: 22px;
  font-weight: 600;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
