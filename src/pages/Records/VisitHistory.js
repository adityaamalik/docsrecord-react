import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Button, CircularProgress } from "../../components/glass";
import VisitForm from "./VisitForm";
import "./visits.css";

const NextAppointment = ({ patient }) => {
  const [next, setNext] = useState(null);

  useEffect(() => {
    let active = true;
    axios
      .get(
        `/appointments?patient=${patient._id}&from=${new Date().toISOString()}`
      )
      .then((response) => {
        if (!active) return;
        setNext(response.data.find((a) => a.status === "scheduled") || null);
      })
      .catch((err) => console.log(err));
    return () => {
      active = false;
    };
  }, [patient._id]);

  return (
    <div className="next-appointment">
      <div>
        <span className="next-appointment__label">Next appointment</span>
        <strong>
          {next
            ? moment(next.start).format("ddd, Do MMM YYYY [at] h:mm A")
            : "Not booked"}
        </strong>
      </div>
      <Button
        variant="outlined"
        size="small"
        to={{ pathname: "/appointments", state: { patient } }}
      >
        {next ? "Open calendar" : "Book appointment"}
      </Button>
    </div>
  );
};

const VisitCard = ({ visit, patient, onEdit, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const hasPrescription = visit.medicines.length > 0 || !!visit.advice;

  return (
    <article className="visit-card">
      <header className="visit-card__header">
        <strong>{moment(visit.date).format("Do MMM YYYY")}</strong>
        <span>₹ {visit.total_cost} /-</span>
      </header>

      {!!visit.complaint && (
        <p>
          <b>Complaint:</b> {visit.complaint}
        </p>
      )}
      {!!visit.diagnosis && (
        <p>
          <b>Diagnosis:</b> {visit.diagnosis}
        </p>
      )}
      {!!visit.notes && (
        <p>
          <b>Notes:</b> {visit.notes}
        </p>
      )}

      {visit.treatments.length > 0 && (
        <ul className="visit-card__list">
          {visit.treatments.map((t, i) => (
            <li key={i}>
              <span>{t.treatment}</span>
              <span>₹ {t.charges} /-</span>
            </li>
          ))}
        </ul>
      )}

      {visit.medicines.length > 0 && (
        <ul className="visit-card__list visit-card__list--rx">
          {visit.medicines.map((m, i) => (
            <li key={i}>
              <span>
                <b>{m.name}</b> {m.dosage}
              </span>
              <span>
                {[m.frequency, m.duration, m.instructions]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!!visit.advice && (
        <p>
          <b>Advice:</b> {visit.advice}
        </p>
      )}

      <footer className="g-actions visit-card__actions">
        {hasPrescription && (
          <Button
            variant="outlined"
            size="small"
            to={{
              pathname: "/printprescription",
              state: { patient, visit },
            }}
          >
            Print prescription
          </Button>
        )}
        <Button variant="outlined" size="small" onClick={() => onEdit(visit)}>
          Edit
        </Button>
        {confirming ? (
          <>
            <Button
              variant="contained"
              color="danger"
              size="small"
              onClick={() => onDelete(visit)}
            >
              Confirm delete
            </Button>
            <Button size="small" onClick={() => setConfirming(false)}>
              Keep
            </Button>
          </>
        ) : (
          <Button
            size="small"
            color="danger"
            onClick={() => setConfirming(true)}
          >
            Delete
          </Button>
        )}
      </footer>
    </article>
  );
};

const VisitHistory = ({ patient, onChanged }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  // null: form closed. { visit: null }: new visit. { visit }: editing.
  const [form, setForm] = useState(null);

  const load = useCallback(() => {
    return axios
      .get(`/visits?patient=${patient._id}`)
      .then((response) => {
        setVisits(response.data);
        setFailed(false);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [patient._id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const refresh = () => {
    load();
    onChanged();
  };

  const remove = (visit) => {
    axios
      .delete(`/visits/${visit._id}`)
      .then(refresh)
      .catch(() => setFailed(true));
  };

  return (
    <section className="visit-history">
      <NextAppointment patient={patient} />

      <div className="visit-history__heading">
        <h4>Visit history</h4>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setForm({ visit: null })}
        >
          + New visit
        </Button>
      </div>

      {loading && (
        <div className="visit-history__center">
          <CircularProgress />
        </div>
      )}
      {failed && (
        <p className="visit-form__error">
          Could not load visit history. Please try again.
        </p>
      )}
      {!loading && !failed && visits.length === 0 && (
        <p className="visit-history__center">No visits recorded yet.</p>
      )}

      {visits.map((visit) => (
        <VisitCard
          key={visit._id}
          visit={visit}
          patient={patient}
          onEdit={(v) => setForm({ visit: v })}
          onDelete={remove}
        />
      ))}

      {form && (
        <VisitForm
          patient={patient}
          visit={form.visit}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            refresh();
          }}
        />
      )}
    </section>
  );
};

export default VisitHistory;
