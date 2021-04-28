import * as S from "./styles";

const Button = ({ width, height, children, onClick }) => (
  <S.Button onClick={onClick} style={{ height: height, width: width }}>
    {children}
  </S.Button>
);

export default Button;
