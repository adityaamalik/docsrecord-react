import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  DateField,
  Modal,
  SelectField,
  TextField,
} from "../../components/glass";

const BLANK_TREATMENT = { treatment: "", charges: "" };
const BLANK_MEDICINE = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

const updateRow = (rows, index, field, value) =>
  rows.map((row, i) => (i === index ? { ...row, [field]: value } : row));

const VisitForm = ({ patient, visit, onClose, onSaved }) => {
  const [date, setDate] = useState(visit ? visit.date : new Date());
  const [complaint, setComplaint] = useState(visit ? visit.complaint : "");
  const [diagnosis, setDiagnosis] = useState(visit ? visit.diagnosis : "");
  const [notes, setNotes] = useState(visit ? visit.notes : "");
  const [treatments, setTreatments] = useState(visit ? visit.treatments : []);
  const [medicines, setMedicines] = useState(visit ? visit.medicines : []);
  const [advice, setAdvice] = useState(visit ? visit.advice : "");

  const [templates, setTemplates] = useState([]);
  const [appliedTemplate, setAppliedTemplate] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/prescription-templates")
      .then((response) => setTemplates(response.data))
      .catch((err) => console.log(err));
  }, []);

  const applyTemplate = (name) => {
    const template = templates.find((t) => t.name === name);
    if (!template) return;
    setMedicines(template.medicines);
    setAdvice(template.advice);
    setAppliedTemplate(name);
  };

  const saveTemplate = () => {
    const name = newTemplateName.trim();
    axios
      .post("/prescription-templates", { name, medicines, advice })
      .then((response) => {
        setTemplates([
          ...templates.filter((t) => t.name !== name),
          response.data,
        ]);
        setAppliedTemplate(name);
        setNewTemplateName("");
        setError("");
      })
      .catch(() => setError("Could not save the template."));
  };

  const deleteTemplate = () => {
    const template = templates.find((t) => t.name === appliedTemplate);
    if (!template) return;
    axios
      .delete(`/prescription-templates/${template._id}`)
      .then(() => {
        setTemplates(templates.filter((t) => t._id !== template._id));
        setAppliedTemplate("");
      })
      .catch(() => setError("Could not delete the template."));
  };

  const save = () => {
    setSaving(true);
    setError("");
    const data = {
      patient: patient._id,
      date,
      complaint,
      diagnosis,
      notes,
      treatments,
      medicines,
      advice,
    };
    const request = visit
      ? axios.put(`/visits/${visit._id}`, data)
      : axios.post("/visits", data);

    request.then(onSaved).catch(() => {
      setSaving(false);
      setError("Could not save this visit. Please try again.");
    });
  };

  const hasMedicine = medicines.some((m) => m.name.trim());

  return (
    <Modal open onClose={onClose}>
      <div className="g-modal-body g-modal-body--large">
        <h3 className="visit-form__title">
          {visit ? "Edit visit" : "New visit"} · {patient.name}
        </h3>

        <div className="visit-form__fields">
          <DateField
            label="Visit date"
            value={date}
            onChange={(next) => next && setDate(next)}
          />
          <TextField
            label="Complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
          <TextField
            label="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <TextField
            label="Notes"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="visit-form__section">
          <h4>Treatments</h4>
          {treatments.map((row, i) => (
            <div className="visit-form__row visit-form__row--treatment" key={i}>
              <TextField
                label="Treatment"
                value={row.treatment}
                onChange={(e) =>
                  setTreatments(
                    updateRow(treatments, i, "treatment", e.target.value)
                  )
                }
              />
              <TextField
                label="Charges (₹)"
                type="number"
                value={row.charges}
                onChange={(e) =>
                  setTreatments(
                    updateRow(treatments, i, "charges", e.target.value)
                  )
                }
              />
              <Button
                variant="outlined"
                color="danger"
                aria-label="Remove treatment"
                onClick={() =>
                  setTreatments(treatments.filter((_, j) => j !== i))
                }
              >
                <i className="lni-minus" />
              </Button>
            </div>
          ))}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTreatments([...treatments, BLANK_TREATMENT])}
          >
            + Add treatment
          </Button>
        </div>

        <div className="visit-form__section">
          <div className="visit-form__heading">
            <h4>Prescription</h4>
            <div className="visit-form__template">
              <SelectField
                label="Use a template"
                value={appliedTemplate}
                onChange={(e) => applyTemplate(e.target.value)}
                options={templates.map((t) => t.name)}
              />
              {appliedTemplate && (
                <Button size="small" color="danger" onClick={deleteTemplate}>
                  Delete template
                </Button>
              )}
            </div>
          </div>

          {medicines.map((row, i) => (
            <div className="visit-form__row visit-form__row--medicine" key={i}>
              {[
                ["name", "Medicine"],
                ["dosage", "Dosage"],
                ["frequency", "Frequency (1-0-1)"],
                ["duration", "Duration"],
                ["instructions", "Instructions"],
              ].map(([field, label]) => (
                <TextField
                  key={field}
                  label={label}
                  value={row[field]}
                  onChange={(e) =>
                    setMedicines(updateRow(medicines, i, field, e.target.value))
                  }
                />
              ))}
              <Button
                variant="outlined"
                color="danger"
                aria-label="Remove medicine"
                onClick={() =>
                  setMedicines(medicines.filter((_, j) => j !== i))
                }
              >
                <i className="lni-minus" />
              </Button>
            </div>
          ))}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setMedicines([...medicines, BLANK_MEDICINE])}
          >
            + Add medicine
          </Button>

          <TextField
            className="visit-form__advice"
            label="Advice"
            multiline
            rows={2}
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
          />

          {hasMedicine && (
            <div className="visit-form__save-template">
              <TextField
                size="small"
                label="Save this prescription as a template"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
              <Button
                variant="outlined"
                size="small"
                disabled={!newTemplateName.trim()}
                onClick={saveTemplate}
              >
                Save template
              </Button>
            </div>
          )}
        </div>

        {error && <p className="visit-form__error">{error}</p>}

        <div className="g-actions visit-form__actions">
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={save}
          >
            {saving ? "Saving ..." : "Save visit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VisitForm;
