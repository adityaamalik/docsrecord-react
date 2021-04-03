import styled from "styled-components";

export const Header = styled.header`
  margin-top: 30px;
  text-align: center;
`;

export const CustomNavLinkSmall = styled.span`
  font-size: 1rem;
  color: #000000;
  transition: color 0.2s ease-in;
  margin: 0.25rem 2rem;

  @media only screen and (max-width: 768px) {
    margin: 1.25rem 2rem;
  }
`;

export const Span = styled.a`
  color: black;
  position: relative;
  transition: 0.2s ease-in;
  cursor: pointer;

  &:hover {
    color: gray;
    top: -2px;
  }
`;
