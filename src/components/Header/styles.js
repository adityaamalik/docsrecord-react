import styled from "styled-components";
import { Link } from "react-router-dom";

export const Header = styled.header`
  margin-top: 30px;
  text-align: center;
`;

export const Logo = styled.img`
  height: 50px;
  width: 50px;
  @media only screen and (max-width: 768px) {
    height: 20px;
    width: 20px;
  }
`;

export const Heading = styled(Link)`
  font-size: 30px;
  color: #004aad;
  &:hover {
    color: gray;
  }
  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

export const DropdownIcon = styled.i`
  color: #004aad;
  font-size: 30px;
`;

export const Span = styled(Link)`
  color: #004aad;
  position: relative;
  transition: 0.2s ease-in;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    color: gray;
    top: -2px;
  }
`;
