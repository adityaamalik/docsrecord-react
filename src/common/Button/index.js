import * as S from "./styles";

const Button = ({ color, width, height, children, onClick }) => (
  <S.Button
    color={color}
    onClick={onClick}
    style={{ height: height, width: width }}
  >
    {children}
  </S.Button>
);

export default Button;
