import "./App.css";
import { useState } from "react";
import _ from "lodash";
import CodeContainer from "./components/code-container";

export default function App() {
  const [form, setForm] = useState({
    actions: [],
    category: "",
    isMobile: false,
    isDesktop: false
  });
  const [eventActionVariables, setEventActionVariables] = useState([]);
  const [eventMobileMapping, setEventMobileMapping] = useState([]);
  const [eventDesktopMapping, setEventDesktopMapping] = useState([]);
  const [error, setError] = useState(false);

  const inputHandler = (value, dataKey) => {
    setForm({
      ...form,
      [dataKey]: value
    });
  };

  const handleGaGeneration = () => {
    if (!form.action && !form.category) {
      setError(true);
      return;
    }

    setError(false);

    const formatActions = form.actions.trim().split(/\n/);
    const eventVariables = [];
    const mobileEventMappings = [];
    const desktopEventMappings = [];

    formatActions.forEach((event) => {
      eventVariables.push(`${[_.camelCase(event)]}: "${event.trim()}",`);
      mobileEventMappings.push(`[MOBILE_EVENTS.${_.camelCase(event)}]: {
        event: "custom_event",
        eventCategory: "${form.category}",
        eventAction: "${event.trim()}"
    },`);
      desktopEventMappings.push(`[DESKTOP_EVENTS.${_.camelCase(event)}]: {
        event: "custom_event",
        eventCategory: "${form.category}",
        eventAction: "${event.trim()}"
    },`);
    });

    setEventActionVariables(eventVariables);
    setEventMobileMapping(mobileEventMappings);
    setEventDesktopMapping(desktopEventMappings);
  };

  console.log(eventActionVariables);

  return (
    <div
      className="App"
      onSubmit={(e) => {
        e.preventDefault();
        console.log(e.target);
      }}
    >
      <h2>GA Events Mapping Generator</h2>
      <textarea
        type="text"
        name="actions"
        onChange={(e) => inputHandler(e.target.value, "actions")}
        value={form.actions}
        cols="40"
        rows="10"
        placeholder="Enter Event Actions (separated by line)"
      />
      <input
        onChange={(e) => inputHandler(e.target.value, "category")}
        value={form.category}
        name="category"
        type="text"
        placeholder="Enter Category"
      />
      <div className="checkboxes">
        <span>Select Platform:</span>
        <div>
          <input
            onChange={(e) => inputHandler(e.target.checked, "isMobile")}
            value={form.isMobile}
            id="mobileEvents"
            type="checkbox"
            name="mobileEvents"
          />
          <label htmlFor="mobileEvents">Mobile Events</label>
        </div>
        <div>
          <input
            onChange={(e) => inputHandler(e.target.checked, "isDesktop")}
            value={form.isDesktop}
            id="desktopEvents"
            type="checkbox"
            name="desktopEvents"
          />
          <label htmlFor="desktopEvents">Desktop Events</label>
        </div>
      </div>
      {error && (
        <span style={{ color: "red", padding: "0 5px" }}>
          Please fill all the fields
        </span>
      )}
      <button onClick={handleGaGeneration}>Generate</button>
      {eventActionVariables.length > 0 && (
          <CodeContainer title={"Variables"} mapping={eventActionVariables} />
      )}
      <div className="mappings">
        <div>
          {form.isMobile && eventMobileMapping.length > 0 && (
              <CodeContainer title={"Mobile Mapping"} mapping={eventMobileMapping} />
          )}
        </div>
        <div>
          {form.isDesktop && eventDesktopMapping.length > 0 && (
              <CodeContainer title={"Desktop Mapping"} mapping={eventDesktopMapping} />
          )}
        </div>
      </div>
    </div>
  );
}
