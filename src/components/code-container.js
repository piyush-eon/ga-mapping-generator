import React from 'react'

const CodeContainer = ({title,mapping}) => {
  return (
    <>
    <span>{title}</span>
    <code>
      <button
        className="copyBtn"
        onClick={() => {
          navigator.clipboard.writeText(
            mapping.join("\n")
          );
        }}
      >
        copy
      </button>
      {mapping.map((mapping) => {
        return (
          <span style={{ whiteSpace: "pre-line" }}>
            {mapping}
            <br />
          </span>
        );
      })}
    </code>
  </>
  )
}

export default CodeContainer