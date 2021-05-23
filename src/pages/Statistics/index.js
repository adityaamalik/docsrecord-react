import * as S from "./styles";
import Graph from "../../components/Graph";
import { Line } from "react-chartjs-2";
import CountUp from "react-countup";
import { Col, message } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const Statistics = () => {
  const [stats, setStats] = useState({});
  const [monthData, setMonthData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const doctor = localStorage.getItem("docsrecordDoctor");

    axios
      .get(`/patients/stats/${doctor}`)
      .then((response) => {
        setStats(response.data);
        const Monthdata = [
          { month: "Jan", patients: response.data.monthstats[0] },
          { month: "Feb", patients: response.data.monthstats[1] },
          { month: "Mar", patients: response.data.monthstats[2] },
          { month: "Apr", patients: response.data.monthstats[3] },
          { month: "May", patients: response.data.monthstats[4] },
          { month: "Jun", patients: response.data.monthstats[5] },
          { month: "Jul", patients: response.data.monthstats[6] },
          { month: "Aug", patients: response.data.monthstats[7] },
          { month: "Sep", patients: response.data.monthstats[8] },
          { month: "Oct", patients: response.data.monthstats[9] },
          { month: "Nov", patients: response.data.monthstats[10] },
          { month: "Dec", patients: response.data.monthstats[11] },
        ];

        setMonthData(Monthdata);

        const WeekData = [
          { week: "Mon", patients: response.data.weekstats[1] },
          { week: "Tues", patients: response.data.weekstats[2] },
          { week: "Wed", patients: response.data.weekstats[3] },
          { week: "Thurs", patients: response.data.weekstats[4] },
          { week: "Fri", patients: response.data.weekstats[5] },
          { week: "Sat", patients: response.data.weekstats[6] },
          { week: "Sun", patients: response.data.weekstats[0] },
        ];

        setWeekData(WeekData);

        setIsLoading(false);
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !")
            .then(() => (window.location.pathname = "/login"));
        }
        setIsLoading(false);
      });
  }, []);
  const state = {
    labels: ["January", "February", "March", "April", "May", "Jun"],
    datasets: [
      {
        label: "Rainfall",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [10, 20, 25, 43, 67],
      },
    ],
  };

  return (
    <>
      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <LoadingOutlined style={{ fontSize: "50px" }} />
        </div>
      ) : (
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
                {stats.currentmonth !== undefined && (
                  <CountUp end={stats.currentmonth} duration={4} />
                )}
              </S.CounterCol>
              <S.CounterCol span={12}>
                {stats.currentweek !== undefined && (
                  <CountUp end={stats.currentweek} duration={4} />
                )}
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
            <S.CounterRow align="middle" justify="center">
              {!!stats.monthpercentage && (
                <S.CounterCol span={12}>
                  <CountUp end={stats.monthpercentage} duration={4} />
                  <span>%</span>
                  {stats.monthpercentage > 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </S.CounterCol>
              )}

              {!!stats.weekpercentage && (
                <S.CounterCol span={12}>
                  <CountUp end={stats.weekpercentage} duration={4} />
                  <span>%</span>
                  {stats.weekpercentage > 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </S.CounterCol>
              )}
            </S.CounterRow>

            <S.CounterRow align="middle" justify="center">
              {!!stats.monthpercentage && (
                <Col span={12}>
                  <span>SINCE LAST MONTH</span>
                </Col>
              )}
              {!!stats.weekpercentage && (
                <Col span={12}>
                  <span>SINCE LAST WEEK</span>
                </Col>
              )}
            </S.CounterRow>
          </S.CounterContainer>

          <S.Container>
            <h1>Monthly Graph</h1>
            <Graph data={monthData} type="month" />
          </S.Container>

          <br />
          <br />
          <br />
          <S.GraphC>
            <Line
              data={state}
              options={{
                title: {
                  display: true,
                  text: "Average Rainfall per month",
                  fontSize: 20,
                },
                legend: {
                  display: true,
                  position: "right",
                },
              }}
            />
          </S.GraphC>
          <S.Container>
            <h1>Weekly Graph</h1>
            <Graph data={weekData} type="week" />
            <Line
              width={100}
              height={150}
              options={{ maintainAspectRatio: false }}
              data={state}
              options={{
                title: {
                  display: true,
                  text: "Average Rainfall per month",
                  fontSize: 20,
                },
                legend: {
                  display: true,
                  position: "right",
                },
              }}
            />
          </S.Container>

          <br />
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default Statistics;
