import { Line } from "@ant-design/charts";

const Graph = (props) => {
  const { data, type } = props;

  const config = {
    data,
    height: 400,
    xField: type,
    yField: "patients",
    point: {
      size: 5,
      shape: "diamond",
    },
  };
  return (
    <>
      <Line {...config} />
    </>
  );
};

export default Graph;
