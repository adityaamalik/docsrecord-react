import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import * as S from "./styles";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
} from "../../components/glass";
import AppointmentDialog from "./AppointmentDialog";
import "./calendar.css";

const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 20;
const HOUR_HEIGHT = 64;
const SNAP_MINUTES = 15;
const PHONE_QUERY = "(max-width: 767px)";

const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(
    () => window.matchMedia(PHONE_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const update = (e) => setIsPhone(e.matches);
    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return isPhone;
};

// Places overlapping appointments side by side within their cluster.
const layoutDay = (items) => {
  const sorted = [...items].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );
  const placed = [];
  let cluster = [];
  let clusterEnd = 0;

  const flush = () => {
    const columnEnds = [];
    const assigned = cluster.map((appointment) => {
      const start = new Date(appointment.start).getTime();
      let column = columnEnds.findIndex((end) => end <= start);
      if (column === -1) {
        column = columnEnds.length;
        columnEnds.push(0);
      }
      columnEnds[column] = new Date(appointment.end).getTime();
      return { appointment, column };
    });
    assigned.forEach((item) =>
      placed.push({ ...item, columns: columnEnds.length })
    );
  };

  sorted.forEach((appointment) => {
    const start = new Date(appointment.start).getTime();
    if (cluster.length > 0 && start >= clusterEnd) {
      flush();
      cluster = [];
      clusterEnd = 0;
    }
    cluster.push(appointment);
    clusterEnd = Math.max(clusterEnd, new Date(appointment.end).getTime());
  });
  if (cluster.length > 0) flush();

  return placed;
};

const nextHalfHour = () => {
  const next = moment().add(30, "minutes");
  return next
    .minute(Math.ceil(next.minute() / 30) * 30)
    .second(0)
    .millisecond(0);
};

const Appointments = (props) => {
  const history = useHistory();
  const isPhone = useIsPhone();

  const [view, setView] = useState("week");
  const [anchor, setAnchor] = useState(() => moment().startOf("day"));
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => moment());

  const activeView = isPhone ? "day" : view;

  const days = useMemo(() => {
    if (activeView === "day") return [anchor.clone()];
    const monday = anchor.clone().startOf("isoWeek");
    return Array.from({ length: 7 }, (_, i) => monday.clone().add(i, "days"));
  }, [activeView, anchor]);

  const rangeStart = days[0].valueOf();
  const rangeEnd = days[days.length - 1].clone().endOf("day").valueOf();

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      setToast({ severity: "error", text: "Please login first!" });
      setTimeout(() => {
        window.location.pathname = "/";
      }, 1000);
      return true;
    }
    return false;
  };

  const load = useCallback(() => {
    const from = new Date(rangeStart).toISOString();
    const to = new Date(rangeEnd + 1).toISOString();
    return axios
      .get(`/appointments?from=${from}&to=${to}`)
      .then((response) => setAppointments(response.data))
      .catch((err) => {
        if (!handleAuthError(err)) {
          setToast({ severity: "error", text: "Could not load appointments." });
        }
      })
      .finally(() => setLoading(false));
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const doctor = localStorage.getItem("docsrecordDoctor");
    axios
      .get(`/patients?doctor=${doctor}`)
      .then((response) => setPatients(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(moment()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Arriving from a patient's record opens the booking form for them.
  const incomingPatient = props.location.state && props.location.state.patient;
  useEffect(() => {
    if (!incomingPatient) return;
    setDialog({ start: nextHalfHour().toDate(), patient: incomingPatient });
    history.replace({ pathname: "/appointments" });
  }, [incomingPatient, history]);

  const openNew = () => {
    const isFuture = anchor.isAfter(moment(), "day");
    const start = isFuture
      ? anchor.clone().hour(10).minute(0).toDate()
      : nextHalfHour().toDate();
    setDialog({ start, patient: null });
  };

  const { startHour, endHour } = useMemo(() => {
    let first = DEFAULT_START_HOUR;
    let last = DEFAULT_END_HOUR;
    appointments.forEach((a) => {
      first = Math.min(first, new Date(a.start).getHours());
      const end = new Date(a.end);
      last = Math.max(last, end.getHours() + (end.getMinutes() > 0 ? 1 : 0));
    });
    return { startHour: first, endHour: Math.min(last, 24) };
  }, [appointments]);

  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  );

  const clickSlot = (day, e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const minutes = ((e.clientY - box.top) / HOUR_HEIGHT) * 60;
    const snapped = Math.floor(minutes / SNAP_MINUTES) * SNAP_MINUTES;
    const start = day.clone().hour(startHour).minute(0).add(snapped, "minutes");

    if (start.isBefore(moment())) {
      setToast({ severity: "error", text: "That time has already passed." });
      return;
    }
    setDialog({ start: start.toDate(), patient: null });
  };

  const move = (direction) =>
    setAnchor(
      anchor.clone().add(direction, activeView === "day" ? "days" : "weeks")
    );

  const title =
    activeView === "day"
      ? anchor.format("ddd, D MMM YYYY")
      : `${days[0].format("D MMM")} – ${days[6].format("D MMM YYYY")}`;

  const saved = (appointment, status) => {
    setDialog(null);
    const text = {
      completed: "Appointment marked as completed.",
      no_show: "Marked as no-show.",
      cancelled: "Appointment cancelled.",
    }[status];
    setToast({ severity: "success", text: text || "Appointment saved." });

    const start = moment(appointment.start);
    if (start.valueOf() < rangeStart || start.valueOf() > rangeEnd) {
      setAnchor(start.clone().startOf("day"));
    } else {
      load();
    }
  };

  return (
    <>
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
      >
        {toast && (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.text}
          </Alert>
        )}
      </Snackbar>

      <S.Container>
        <div className="cal-toolbar glass-panel">
          <div className="cal-toolbar__group">
            <Button
              variant="outlined"
              size="small"
              aria-label="Previous"
              onClick={() => move(-1)}
            >
              <i className="material-icons">chevron_left</i>
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setAnchor(moment().startOf("day"))}
            >
              Today
            </Button>
            <Button
              variant="outlined"
              size="small"
              aria-label="Next"
              onClick={() => move(1)}
            >
              <i className="material-icons">chevron_right</i>
            </Button>
          </div>

          <h1 className="cal-toolbar__title">{title}</h1>

          <div className="cal-toolbar__group">
            {!isPhone && (
              <div className="cal-switch" role="group" aria-label="View">
                {["day", "week"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={view === option}
                    className={view === option ? "is-active" : ""}
                    onClick={() => setView(option)}
                  >
                    {option === "day" ? "Day" : "Week"}
                  </button>
                ))}
              </div>
            )}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={openNew}
            >
              + New
            </Button>
          </div>
        </div>

        <div className="cal glass-panel">
          {loading && (
            <div className="cal__loading">
              <CircularProgress />
            </div>
          )}
          <div className="cal__scroll">
            <div className="cal__head">
              <div className="cal__gutter" />
              {days.map((day) => (
                <div
                  key={day.valueOf()}
                  className={`cal__day-title${
                    day.isSame(now, "day") ? " is-today" : ""
                  }`}
                >
                  <span>{day.format("ddd")}</span>
                  <strong>{day.format("D")}</strong>
                </div>
              ))}
            </div>

            <div className="cal__body">
              <div className="cal__gutter">
                {hours.map((hour) => (
                  <div
                    className="cal__hour"
                    key={hour}
                    style={{ height: HOUR_HEIGHT }}
                  >
                    {moment().hour(hour).minute(0).format("h A")}
                  </div>
                ))}
              </div>

              {days.map((day) => {
                const items = appointments.filter((a) =>
                  moment(a.start).isSame(day, "day")
                );
                const nowOffset =
                  (now.hour() + now.minute() / 60 - startHour) * HOUR_HEIGHT;

                return (
                  <div
                    key={day.valueOf()}
                    className="cal__column"
                    style={{
                      height: hours.length * HOUR_HEIGHT,
                      backgroundSize: `100% ${HOUR_HEIGHT}px`,
                    }}
                    onClick={(e) => clickSlot(day, e)}
                  >
                    {day.isSame(now, "day") &&
                      nowOffset >= 0 &&
                      nowOffset <= hours.length * HOUR_HEIGHT && (
                        <div className="cal__now" style={{ top: nowOffset }} />
                      )}

                    {layoutDay(items).map(
                      ({ appointment, column, columns }) => {
                        const start = moment(appointment.start);
                        const minutes = moment(appointment.end).diff(
                          start,
                          "minutes"
                        );
                        const top =
                          ((start.hour() - startHour) * 60 + start.minute()) *
                          (HOUR_HEIGHT / 60);
                        const name = appointment.patient
                          ? appointment.patient.name
                          : "Patient";

                        return (
                          <button
                            key={appointment._id}
                            type="button"
                            className={`cal-event cal-event--${appointment.status}`}
                            style={{
                              top,
                              height: Math.max(
                                minutes * (HOUR_HEIGHT / 60) - 2,
                                22
                              ),
                              left: `${(column / columns) * 100}%`,
                              width: `calc(${100 / columns}% - 3px)`,
                            }}
                            aria-label={`${name}, ${start.format("h:mm A")}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDialog({ appointment });
                            }}
                          >
                            <b>{name}</b>
                            <span>{start.format("h:mm A")}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </S.Container>

      {dialog && (
        <AppointmentDialog
          dialog={dialog}
          patients={patients}
          onClose={() => setDialog(null)}
          onSaved={saved}
          onError={() =>
            setToast({
              severity: "error",
              text: "Could not update the appointment.",
            })
          }
        />
      )}
    </>
  );
};

export default Appointments;
