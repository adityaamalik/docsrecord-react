import * as S from "./styles";
import Graph from "../../components/Graph";
import CountUp from "react-countup";
import { Col, message } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import axios from "axios";

const Statistics = () => {
  useEffect(() => {
    const doctor = localStorage.getItem("docsrecordDoctor");

    axios
      .get(`/patients/stats/${doctor}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !")
            .then(() => (window.location.pathname = "/login"));
        }
      });
  }, []);

  const YearData = [
    { year: "2017", patients: 50 },
    { year: "2018", patients: 10 },
    { year: "2019", patients: 30 },
    { year: "2020", patients: 30 },
    { year: "2021", patients: 150 },
  ];

  const Monthdata = [
    { month: "Jan", patients: 10 },
    { month: "Feb", patients: 30 },
    { month: "Mar", patients: 30 },
    { month: "Apr", patients: 50 },
    { month: "May", patients: 10 },
    { month: "Jun", patients: 30 },
    { month: "Jul", patients: 30 },
    { month: "Aug", patients: 50 },
    { month: "Sep", patients: 10 },
    { month: "Oct", patients: 30 },
    { month: "Nov", patients: 30 },
    { month: "Dec", patients: 1 },
  ];

  const WeekData = [
    { week: "Mon", patients: 10 },
    { week: "Tues", patients: 30 },
    { week: "Wed", patients: 30 },
    { week: "Thurs", patients: 50 },
    { week: "Fri", patients: 10 },
    { week: "Sat", patients: 30 },
    { week: "Sun", patients: 30 },
  ];

  return (
    <>
      <S.CounterContainer>
        <S.CounterRow align="middle">
          <Col span={12}>
            <S.CounterHeading>THIS MONTH</S.CounterHeading>
          </Col>
          <Col span={12}>
            <S.CounterHeading>THIS WEEK</S.CounterHeading>
          </Col>
        </S.CounterRow>
      </S.CounterContainer>

      <S.CounterContainer>
        <S.CounterRow align="middle">
          <S.CounterCol span={12}>
            <CountUp end={1000} duration={4} />
          </S.CounterCol>
          <S.CounterCol span={12}>
            <CountUp end={1000} duration={4} />
          </S.CounterCol>
        </S.CounterRow>
        <S.CounterRow align="middle">
          <Col span={12}>
            <span>PATIENTS</span>
          </Col>
          <Col span={12}>
            <span>PATIENTS</span>
          </Col>
        </S.CounterRow>
      </S.CounterContainer>

      <S.CounterContainer>
        <S.CounterRow align="middle">
          <S.CounterCol span={12}>
            <CountUp end={100} duration={4} />
            <span>%</span>
            <ArrowUpOutlined />
          </S.CounterCol>
          <S.CounterCol span={12}>
            <CountUp end={100} duration={4} />
            <span>%</span>
            <ArrowDownOutlined />
          </S.CounterCol>
        </S.CounterRow>
        <S.CounterRow align="middle">
          <Col span={12}>
            <span>SINCE LAST MONTH</span>
          </Col>
          <Col span={12}>
            <span>SINCE LAST WEEK</span>
          </Col>
        </S.CounterRow>
      </S.CounterContainer>

      <S.Container>
        <h1>Monthly Graph</h1>
        <Graph data={Monthdata} type="month" />
      </S.Container>

      <S.Container>
        <h1>Weekly Graph</h1>
        <Graph data={WeekData} type="week" />
      </S.Container>

      <S.Container>
        <h1>Yearly Graph</h1>
        <Graph data={YearData} type="year" />
      </S.Container>
    </>
  );
};

export default Statistics;
