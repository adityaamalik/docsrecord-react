import { useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  Button,
  Checkbox,
  DateField,
  Modal,
  SelectField,
  TextField,
  TimeField,
} from "../../components/glass";

const DURATIONS = [15, 30, 45, 60];

const PatientPicker = ({ patients, value, onChange, locked }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return patients
      .filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          String(p.phone_number || "").includes(needle)
      )
      .slice(0, 8);
  }, [patients, query]);

  if (value) {
    return (
      <div className="appt-patient">
        <div>
          <strong>{value.name}</strong>
          {!!value.phone_number && <span>+91 {value.phone_number}</span>}
        </div>
        {!locked && (
          <Button size="small" onClick={() => onChange(null)}>
            Change
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="appt-picker">
      <TextField
        label="Search patient by name or phone"
        value={query}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && (
        <ul className="g-select__menu">
          {matches.length === 0 && (
            <li className="appt-picker__empty">No matching patients</li>
          )}
          {matches.map((p) => (
            <li key={p._id}>
              <button
                type="button"
                className="appt-picker__option"
                onClick={() => onChange(p)}
              >
                <span>{p.name}</span>
                <small>{p.phone_number}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const errorMessage = (err) =>
  err.response && typeof err.response.data === "string"
    ? err.response.data
    : "Could not save the appointment. Please try again.";

const AppointmentForm = ({
  appointment,
  initial,
  patients,
  onClose,
  onSaved,
}) => {
  const [patient, setPatient] = useState(
    appointment ? appointment.patient : initial.patient || null
  );
  const [start, setStart] = useState(
    new Date(appointment ? appointment.start : initial.start)
  );
  const currentDuration = appointment
    ? Math.round(
        (new Date(appointment.end) - new Date(appointment.start)) / 60000
      )
    : 30;
  const [duration, setDuration] = useState(currentDuration);
  const [reason, setReason] = useState(appointment ? appointment.reason : "");
  const [optIn, setOptIn] = useState(!!(patient && patient.reminders_opt_in));
  const [conflict, setConflict] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const durations = [...new Set([...DURATIONS, currentDuration])].sort(
    (a, b) => a - b
  );

  const choosePatient = (next) => {
    setPatient(next);
    setOptIn(!!(next && next.reminders_opt_in));
  };

  const submit = (force) => {
    setSaving(true);
    setError("");
    setConflict(null);
    const data = {
      start,
      duration_minutes: duration,
      reason,
      reminders_opt_in: optIn,
      force,
    };
    const request = appointment
      ? axios.put(`/appointments/${appointment._id}`, data)
      : axios.post("/appointments", { ...data, patient: patient._id });

    request
      .then((response) => onSaved(response.data))
      .catch((err) => {
        setSaving(false);
        if (err.response && err.response.status === 409) {
          setConflict(err.response.data.conflict);
        } else {
          setError(errorMessage(err));
        }
      });
  };

  return (
    <div className="appt-form">
      <h3>{appointment ? "Reschedule appointment" : "New appointment"}</h3>

      {appointment ? (
        <PatientPicker patients={[]} value={patient} locked />
      ) : (
        <PatientPicker
          patients={patients}
          value={patient}
          onChange={choosePatient}
        />
      )}

      <div className="appt-form__grid">
        <DateField
          label="Date"
          value={start}
          minDate={new Date()}
          onChange={(next) => next && setStart(next)}
        />
        <TimeField label="Time" value={start} onChange={setStart} />
        <SelectField
          label="Duration"
          value={`${duration} minutes`}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          options={durations.map((d) => `${d} minutes`)}
        />
        <TextField
          label="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <Checkbox
        checked={optIn}
        onChange={setOptIn}
        label="Patient has agreed to WhatsApp/SMS reminders"
      />

      {!!conflict && (
        <div className="appt-warning" role="alert">
          <i className="material-icons" aria-hidden="true">
            warning
          </i>
          <span>
            Overlaps with <b>{conflict.patient}</b> at{" "}
            {moment(conflict.start).format("h:mm A")}.
          </span>
        </div>
      )}
      {!!error && <p className="visit-form__error">{error}</p>}

      <div className="g-actions appt-form__actions">
        <Button variant="contained" onClick={onClose}>
          Back
        </Button>
        {conflict ? (
          <Button
            variant="contained"
            color="danger"
            disabled={saving}
            onClick={() => submit(true)}
          >
            Book anyway
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={saving || !patient}
            onClick={() => submit(false)}
          >
            {saving ? "Saving ..." : "Save appointment"}
          </Button>
        )}
      </div>
    </div>
  );
};

const STATUS_LABEL = {
  scheduled: "Scheduled",
  completed: "Completed",
  no_show: "No-show",
};

const reminderText = (appointment) => {
  const { reminder_status: status, reminder_channel: channel } = appointment;
  if (status === "sent") {
    return `Sent on ${channel === "whatsapp" ? "WhatsApp" : "SMS"}`;
  }
  if (status === "failed") return "Could not be delivered";
  if (status === "skipped") return "Skipped: phone number is not valid";
  if (status === "sending") return "Sending";
  if (!appointment.patient || !appointment.patient.reminders_opt_in) {
    return "Off: patient has not agreed";
  }
  return "Goes out 24 hours before";
};

const AppointmentDetails = ({ appointment, onEdit, onStatus }) => {
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const { patient } = appointment;
  const scheduled = appointment.status === "scheduled";

  return (
    <div className="appt-form">
      <h3>{patient ? patient.name : "Patient"}</h3>
      <dl className="appt-details">
        <dt>When</dt>
        <dd>
          {moment(appointment.start).format("ddd, Do MMM YYYY")},{" "}
          {moment(appointment.start).format("h:mm A")} –{" "}
          {moment(appointment.end).format("h:mm A")}
        </dd>
        {!!patient && !!patient.phone_number && (
          <>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:+91${patient.phone_number}`}>
                +91 {patient.phone_number}
              </a>
            </dd>
          </>
        )}
        {!!appointment.reason && (
          <>
            <dt>Reason</dt>
            <dd>{appointment.reason}</dd>
          </>
        )}
        <dt>Status</dt>
        <dd>{STATUS_LABEL[appointment.status]}</dd>
        {scheduled && (
          <>
            <dt>Reminder</dt>
            <dd>{reminderText(appointment)}</dd>
          </>
        )}
      </dl>

      {scheduled && (
        <div className="g-actions appt-form__actions">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onStatus("completed")}
          >
            Mark completed
          </Button>
          <Button variant="outlined" onClick={onEdit}>
            Reschedule
          </Button>
          <Button variant="outlined" onClick={() => onStatus("no_show")}>
            No-show
          </Button>
          {confirmingCancel ? (
            <Button
              variant="contained"
              color="danger"
              onClick={() => onStatus("cancelled")}
            >
              Confirm cancel
            </Button>
          ) : (
            <Button color="danger" onClick={() => setConfirmingCancel(true)}>
              Cancel appointment
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const AppointmentDialog = ({ dialog, patients, onClose, onSaved, onError }) => {
  const [editing, setEditing] = useState(false);

  const updateStatus = (status) => {
    axios
      .put(`/appointments/${dialog.appointment._id}`, { status })
      .then((response) => onSaved(response.data, status))
      .catch(onError);
  };

  return (
    <Modal open onClose={onClose}>
      <div className="g-modal-body g-modal-body--appointment">
        {dialog.appointment && !editing ? (
          <AppointmentDetails
            appointment={dialog.appointment}
            onEdit={() => setEditing(true)}
            onStatus={updateStatus}
          />
        ) : (
          <AppointmentForm
            appointment={dialog.appointment}
            initial={dialog}
            patients={patients}
            onClose={editing ? () => setEditing(false) : onClose}
            onSaved={(saved) => onSaved(saved)}
          />
        )}
      </div>
    </Modal>
  );
};

export default AppointmentDialog;
