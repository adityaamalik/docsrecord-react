import * as S from "./styles";

import { Line } from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import CountUp from "react-countup";
import CircularProgress from "@material-ui/core/CircularProgress";

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
        // const Monthdata = [
        //   response.data.monthstats[0],
        //   response.data.monthstats[1],
        //   response.data.monthstats[2],
        //   response.data.monthstats[3],
        //   response.data.monthstats[4],
        //   response.data.monthstats[18],
        //   8,
        // ];

        setMonthData(response.data.monthstats);

        const WeekData = [
          response.data.weekstats[1],
          response.data.weekstats[2],
          response.data.weekstats[3],
          response.data.weekstats[4],
          response.data.weekstats[5],
          response.data.weekstats[6],
          response.data.weekstats[0],
        ];

        setWeekData(WeekData);

        setIsLoading(false);
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          // message
          //   .error("You are unauthorized user, please login first !")
          //   .then(() => (window.location.pathname = "/login"));
        }
        setIsLoading(false);
      });
  }, []);

  const Weekstate = {
    labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Patient",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: weekData,
      },
    ],
  };

  const Monthstate = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Patient",
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: monthData,
      },
    ],
  };

  return (
    <>
      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <S.CounterHeading>THIS MONTH</S.CounterHeading>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <S.CounterHeading>THIS WEEK</S.CounterHeading>
            </Grid>
          </Grid>
          {/* <S.CounterRow align="middle">
            <Col span={12}>
              <S.CounterHeading>THIS MONTH</S.CounterHeading>
            </Col>
            <Col span={12}>
              <S.CounterHeading>THIS WEEK</S.CounterHeading>
            </Col>
          </S.CounterRow> */}

          <Grid container direction="row" justify="center" alignItems="center">
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <S.CounterHeading2>
                {stats.currentmonth !== undefined && (
                  <CountUp end={stats.currentmonth} duration={4} />
                )}
              </S.CounterHeading2>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              {" "}
              <S.CounterHeading2>
                {stats.currentweek !== undefined && (
                  <div>
                    <CountUp end={stats.currentweek} duration={4} />
                  </div>
                )}
              </S.CounterHeading2>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <span>PATIENTS</span>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              {" "}
              <span>PATIENTS</span>
            </Grid>
          </Grid>

          {/* <S.CounterContainer>
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
          </S.CounterContainer> */}

          <Grid container direction="row" justify="center" alignItems="center">
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <S.CounterHeading2>
                {!!stats.monthpercentage && (
                  <Grid>
                    <CountUp end={stats.monthpercentage} duration={4} />
                    <span>%</span>
                    {stats.monthpercentage > 0 ? (
                      <i class="lni lni-stats-up"></i>
                    ) : (
                      <i class="lni lni-stats-down"></i>
                    )}
                  </Grid>
                )}
              </S.CounterHeading2>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              {" "}
              <S.CounterHeading2>
                {!!stats.weekpercentage && (
                  <Grid>
                    <CountUp end={stats.weekpercentage} duration={4} />
                    <span>%</span>
                    {stats.weekpercentage > 0 ? (
                      <i class="lni lni-stats-up"></i>
                    ) : (
                      <i class="lni lni-stats-down"></i>
                    )}
                  </Grid>
                )}
              </S.CounterHeading2>
            </Grid>
          </Grid>

          <Grid container direction="row" justify="center" alignItems="center">
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <span>
                {!!stats.monthpercentage && (
                  <Grid>
                    <span>SINCE LAST MONTH</span>
                  </Grid>
                )}
              </span>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              {" "}
              <span>
                {!!stats.weekpercentage && (
                  <Grid>
                    <span>SINCE LAST WEEK</span>
                  </Grid>
                )}
              </span>
            </Grid>
          </Grid>

          <S.Graphmobile>
            <S.CounterHeading3>Monthly Graph</S.CounterHeading3>
            <Line
              width={25}
              height={25}
              options={
                ({
                  maintainAspectRatio: false,
                },
                {
                  title: {
                    display: true,
                    text: "Patients per month",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                })
              }
              data={Monthstate}
            />
          </S.Graphmobile>
          <S.Graphpc>
            <S.CounterHeading3>Monthly Graph</S.CounterHeading3>
            <Line
              width={15}
              height={5}
              options={
                ({
                  maintainAspectRatio: false,
                },
                {
                  title: {
                    display: true,
                    text: "Patients per month",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                })
              }
              data={Monthstate}
            />
          </S.Graphpc>
          <S.Graphmobile>
            <S.CounterHeading3>Weekly Graph</S.CounterHeading3>
            <Line
              width={25}
              height={25}
              options={
                ({
                  maintainAspectRatio: false,
                },
                {
                  title: {
                    display: true,
                    text: "Patients per month",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                })
              }
              data={Weekstate}
            />
          </S.Graphmobile>
          <S.Graphpc>
            <S.CounterHeading3>Weekly Graph</S.CounterHeading3>
            <Line
              width={15}
              height={5}
              options={
                ({
                  maintainAspectRatio: false,
                },
                {
                  title: {
                    display: true,
                    text: "Patients per month",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                })
              }
              data={Weekstate}
            />
          </S.Graphpc>

          <br />
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default Statistics;
