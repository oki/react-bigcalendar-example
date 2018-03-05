import React from 'react'

function Event({ event }) {
  let type = "Unknown"

  if (event.type === "holiday") {
    type = "Urlop"
  } else if (event.type === "l4") {
    type = "L4"
  }

  return (
    <span className={event.type}>
      <strong>{type}</strong> {event.driver.name}
    </span>
  )
}

export default Event;
