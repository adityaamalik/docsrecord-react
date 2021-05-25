import styled from "styled-components";

export const Container = styled.div`
  margin: 50px;

  @media only screen and (max-width: 1400px) {
    margin: 60px;
  }

  @media only screen and (max-width: 768px) {
    margin: 0px;
  }
`;

export const Heading = styled.h1`
  text-align: center;
  margin-top: 50px;
  @media only screen and (max-width: 768px) {
    marin-top: 50px;
  }
`;
export const ModalDiv = styled.h1`
  display: inline;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const Label = styled.span`
  font-size: 30px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

export const FileUpload = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
  width: 25%;
`;

export const FileUploadLabel = styled.label`
  cursor: pointer;
`;
