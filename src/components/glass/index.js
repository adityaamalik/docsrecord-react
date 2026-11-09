import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import moment from "moment";

import "./styles.css";

const cx = (...names) => names.filter(Boolean).join(" ");

/* ---------- Layout ---------- */

const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];

export const Grid = ({
  container,
  item,
  spacing,
  direction,
  justify,
  alignItems,
  className,
  style,
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  ...rest
}) => {
  const sizes = { xs, sm, md, lg, xl };
  const vars = {};
  BREAKPOINTS.forEach((bp) => {
    if (sizes[bp]) vars[`--g-${bp}`] = `${(sizes[bp] / 12) * 100}%`;
  });
  const flex = container
    ? {
        flexDirection: direction,
        justifyContent: justify,
        alignItems,
      }
    : {};

  return (
    <div
      className={cx(
        "g-grid",
        container && "g-grid--container",
        container && spacing && `g-grid--gap-${spacing}`,
        item && "g-grid--item",
        Object.keys(vars).length > 0 && "g-grid--sized",
        className
      )}
      style={{ ...vars, ...flex, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};

export const Paper = ({ className, elevation, ...rest }) => (
  <div className={cx("glass-panel", className)} {...rest} />
);

export const Card = ({ className, variant, ...rest }) => (
  <div className={cx("glass-panel", className)} {...rest} />
);

/* ---------- Actions ---------- */

export const Button = ({
  variant = "text",
  color,
  size,
  className,
  to,
  href,
  type = "button",
  children,
  ...rest
}) => {
  const classes = cx(
    "g-btn",
    `g-btn--${variant}`,
    color && `g-btn--${color}`,
    size === "small" && "g-btn--small",
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export const CircularProgress = () => (
  <span className="g-spinner" role="progressbar" aria-label="Loading" />
);

/* ---------- Fields ---------- */

// An empty placeholder lets CSS float the label with :placeholder-shown,
// which also covers uncontrolled fields that start from `defaultValue`.
export const TextField = ({
  label,
  size,
  style,
  className,
  variant,
  multiline,
  rows,
  id,
  ...rest
}) => {
  const Control = multiline ? "textarea" : "input";
  const fieldId = useFieldId(id);

  return (
    <div
      className={cx("g-field", size === "small" && "g-field--small", className)}
      style={style}
    >
      <Control
        id={fieldId}
        className="g-field__input"
        placeholder=" "
        rows={multiline ? rows : undefined}
        {...rest}
      />
      <label className="g-field__label" htmlFor={fieldId}>
        {label}
      </label>
    </div>
  );
};

let nextFieldId = 0;
const useFieldId = (id) => {
  const generated = useRef(null);
  if (!generated.current) {
    nextFieldId += 1;
    generated.current = `g-field-${nextFieldId}`;
  }
  return id || generated.current;
};

const PinnedField = ({ label, style, className, ...rest }) => {
  const fieldId = useFieldId();
  return (
    <div className={cx("g-field", "g-field--float", className)} style={style}>
      <input id={fieldId} className="g-field__input" {...rest} />
      <label className="g-field__label" htmlFor={fieldId}>
        {label}
      </label>
    </div>
  );
};

// These keep the time of day of the current value, so a date stored in UTC
// does not slip to the previous day the way local midnight would.
export const DateField = ({ value, onChange, minDate, ...rest }) => {
  const current = value ? new Date(value) : null;

  return (
    <PinnedField
      type="date"
      value={current ? moment(current).format("YYYY-MM-DD") : ""}
      min={minDate ? moment(minDate).format("YYYY-MM-DD") : undefined}
      onChange={(e) => {
        if (!e.target.value) {
          onChange(null);
          return;
        }
        const [year, month, day] = e.target.value.split("-").map(Number);
        const next = current ? new Date(current) : new Date();
        next.setFullYear(year, month - 1, day);
        onChange(next);
      }}
      {...rest}
    />
  );
};

export const TimeField = ({ value, onChange, ...rest }) => {
  const current = value ? new Date(value) : new Date();

  return (
    <PinnedField
      type="time"
      value={moment(current).format("HH:mm")}
      onChange={(e) => {
        if (!e.target.value) return;
        const [hours, minutes] = e.target.value.split(":").map(Number);
        const next = new Date(current);
        next.setHours(hours, minutes, 0, 0);
        onChange(next);
      }}
      {...rest}
    />
  );
};

export const SelectField = ({
  label,
  value,
  defaultValue,
  onChange,
  options,
  style,
}) => {
  const [internal, setInternal] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const fieldId = useFieldId();
  const current = value !== undefined ? value : internal;

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (e) => {
      if (root.current && !root.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const openMenu = () => {
    setActive(Math.max(options.indexOf(current), 0));
    setOpen(true);
  };

  const choose = (option) => {
    if (value === undefined) setInternal(option);
    if (onChange) onChange({ target: { value: option } });
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(options[active]);
    }
  };

  return (
    <div
      ref={root}
      className={cx(
        "g-field",
        "g-select",
        (open || current) && "g-field--float"
      )}
      style={style}
    >
      <button
        id={fieldId}
        type="button"
        className="g-field__input g-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${fieldId}-menu`}
        aria-activedescendant={open ? `${fieldId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span>{current}</span>
        <i className="material-icons" aria-hidden="true">
          expand_more
        </i>
      </button>
      <label className="g-field__label" htmlFor={fieldId}>
        {label}
      </label>
      {open && (
        <ul id={`${fieldId}-menu`} role="listbox" className="g-select__menu">
          {options.map((option, i) => (
            <li
              key={option}
              id={`${fieldId}-${i}`}
              role="option"
              aria-selected={option === current}
              className={cx(
                "g-select__option",
                i === active && "is-active",
                option === current && "is-selected"
              )}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ---------- Overlays ---------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modals can stack (plan details open over the payment prompt); only the top
// one reacts to the keyboard, and the page stays locked until the last closes.
const modalStack = [];

export const Modal = ({ open, onClose, children }) => {
  const dialog = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const token = {};
    const previouslyFocused = document.activeElement;
    modalStack.push(token);
    document.body.style.overflow = "hidden";
    if (dialog.current) dialog.current.focus();

    const onKeyDown = (e) => {
      if (modalStack[modalStack.length - 1] !== token || !dialog.current)
        return;
      if (e.key === "Escape") {
        onCloseRef.current();
      } else if (e.key === "Tab") {
        const items = dialog.current.querySelectorAll(FOCUSABLE);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      modalStack.splice(modalStack.indexOf(token), 1);
      if (modalStack.length === 0) document.body.style.overflow = "";
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="g-modal">
      <div className="g-modal__backdrop" onClick={() => onClose()} />
      <div
        ref={dialog}
        className="g-modal__dialog"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button
          type="button"
          className="g-modal__close"
          aria-label="Close"
          onClick={() => onClose()}
        >
          <i className="material-icons" aria-hidden="true">
            close
          </i>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

// Portaled because a blurred ancestor would capture `position: fixed`.
export const Snackbar = ({ open, autoHideDuration, onClose, children }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || !autoHideDuration) return undefined;
    const timer = setTimeout(() => onCloseRef.current(), autoHideDuration);
    return () => clearTimeout(timer);
  }, [open, autoHideDuration]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="g-snackbar">{children}</div>,
    document.body
  );
};

const ALERT_ICONS = { success: "check_circle", error: "error" };

export const Alert = ({ severity = "success", onClose, children }) => (
  <div className={`g-alert g-alert--${severity}`} role="alert">
    <i className="material-icons" aria-hidden="true">
      {ALERT_ICONS[severity]}
    </i>
    <div className="g-alert__message">{children}</div>
    {onClose && (
      <button
        type="button"
        className="g-alert__close"
        aria-label="Dismiss"
        onClick={onClose}
      >
        <i className="material-icons" aria-hidden="true">
          close
        </i>
      </button>
    )}
  </div>
);

/* ---------- Profile image ---------- */

export const Avatar = ({ src, className }) => (
  <span className={cx("g-avatar", className)}>
    {src ? (
      <img src={src} alt="" />
    ) : (
      <i className="material-icons" aria-hidden="true">
        person
      </i>
    )}
  </span>
);

export const Badge = ({ badgeContent, children }) => (
  <span className="g-badge">
    {children}
    <span className="g-badge__content">{badgeContent}</span>
  </span>
);

/* ---------- Table ---------- */

const TableHeadContext = createContext(false);

export const TableContainer = ({ className, ...rest }) => (
  <div className={cx("g-table-wrap", className)} {...rest} />
);

export const Table = ({ stickyHeader, className, ...rest }) => (
  <table
    className={cx("g-table", stickyHeader && "g-table--sticky", className)}
    {...rest}
  />
);

export const TableHead = ({ children }) => (
  <TableHeadContext.Provider value={true}>
    <thead>{children}</thead>
  </TableHeadContext.Provider>
);

export const TableBody = (props) => <tbody {...props} />;

export const TableRow = ({ hover, className, ...rest }) => (
  <tr className={cx(hover && "g-table__row--hover", className)} {...rest} />
);

export const TableCell = ({ align, style, ...rest }) => {
  const Cell = useContext(TableHeadContext) ? "th" : "td";
  return <Cell style={{ textAlign: align, ...style }} {...rest} />;
};

export const TablePagination = ({ count, rowsPerPage, page, onChangePage }) => {
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);

  return (
    <div className="g-pagination">
      <span>
        {from}–{to} of {count}
      </span>
      <button
        type="button"
        className="g-pagination__button"
        aria-label="Previous page"
        disabled={page === 0}
        onClick={(e) => onChangePage(e, page - 1)}
      >
        <i className="material-icons" aria-hidden="true">
          chevron_left
        </i>
      </button>
      <button
        type="button"
        className="g-pagination__button"
        aria-label="Next page"
        disabled={to >= count}
        onClick={(e) => onChangePage(e, page + 1)}
      >
        <i className="material-icons" aria-hidden="true">
          chevron_right
        </i>
      </button>
    </div>
  );
};
