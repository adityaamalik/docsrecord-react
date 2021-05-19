import * as S from "./styles";

const Button = ({ width, height, children, onClick, disabled }) => (
  <S.Button
    disabled={disabled}
    onClick={onClick}
    style={{ height: height, width: width }}
  >
    {children}
  </S.Button>
);

export default Button;
