import styled from "styled-components";

export const Container = styled.div.attrs({ className: "glass-panel" })`
  max-width: 1120px;
  margin: 104px auto 32px;
  padding: 32px 40px 40px;

  @media only screen and (max-width: 1200px) {
    margin: 96px 20px 28px;
    padding: 28px;
  }

  @media only screen and (max-width: 768px) {
    margin: 76px 12px 20px;
    padding: 20px 14px;
  }
`;

export const Heading = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 24px;
  @media only screen and (max-width: 768px) {
    font-size: 26px;
  }
`;

export const ModalDiv = styled.div`
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
