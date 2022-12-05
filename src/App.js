import "./App.css";
import { useState } from "react";
import _ from "lodash";

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
        <>
          <span>Variables</span>
          <code>
            <button
              className="copyBtn"
              onClick={() => {
                navigator.clipboard.writeText(eventActionVariables.join("\n"));
              }}
            >
              copy
            </button>

            <span style={{ whiteSpace: "pre-line" }}>
              {eventActionVariables.join("\n")}
            </span>
          </code>
        </>
      )}
      <div className="mappings">
        <div>
          {form.isMobile && eventMobileMapping.length > 0 && (
            <>
              <span>Mobile Mapping</span>
              <code>
                <button
                  className="copyBtn"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      eventMobileMapping.join("\n")
                    );
                  }}
                >
                  copy
                </button>
                {eventMobileMapping.map((mapping) => {
                  return (
                    <span style={{ whiteSpace: "pre-line" }}>
                      {mapping}
                      <br />
                    </span>
                  );
                })}
              </code>
            </>
          )}
        </div>
        <div>
          {form.isDesktop && eventDesktopMapping.length > 0 && (
            <>
              <span>Desktop Mapping</span>
              <code>
                <button
                  className="copyBtn"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      eventDesktopMapping.join("\n")
                    );
                  }}
                >
                  copy
                </button>
                {eventDesktopMapping.map((mapping) => {
                  return (
                    <span style={{ whiteSpace: "pre-line" }}>
                      {mapping}
                      <br />
                    </span>
                  );
                })}
              </code>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
