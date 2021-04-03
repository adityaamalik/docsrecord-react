import { Row, Col } from "antd";
import { useState } from "react";
import Input from "../../common/Input";
import * as S from "./styles";

const AddPatient = () => {
  const [name, setName] = useState("");

  return (
    <>
      <S.Container>
        <Row>
          <Col span={12}>
            <Input
              type="text"
              label="Name"
              onChange={(val) => setName(val)}
              value={name}
            />
          </Col>
          <Col span={12}>
            <Input
              type="text"
              label="Name"
              onChange={(val) => setName(val)}
              value={name}
            />
          </Col>
        </Row>
      </S.Container>
    </>
  );
};

export default AddPatient;
