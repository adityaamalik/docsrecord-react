import styled from "styled-components";

export const Button = styled.button`
  background: white;
  font-size: 1rem;
  font-weight: 900;
  width: 100%;
  border: ${(props) => (props.disabled ? "2px solid gray" : "2px solid black")};
  color: ${(props) => (props.disabled ? "gray" : "black")};
  border-radius: 50px;
  height: 60px;
  outline: none;
  cursor: ${(props) => (props.disabled ? "none" : "pointer")};
  margin-top: 0.625rem;
  max-width: 180px;

  @media only screen and (max-width: 1024px) {
    width: ${(props) => (props.width ? "160px" : "100%")};
  }

  @media only screen and (max-width: 768px) {
    width: ${(props) => (props.width ? "140px" : "100%")};
  }

  @media only screen and (max-width: 480px) {
    width: ${(props) => (props.width ? "130px" : "100%")};
  }
`;
