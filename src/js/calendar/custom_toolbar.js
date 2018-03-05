import React from 'react'
import SelectFilter from './select_filter'

const CustomToolbar = ({ handleChange, drivers, months, years, selected_driver_ids, selected_month, selected_year }) => props => (
  <div className="col-xs-12 form-inline custom-filters">

    <SelectFilter
      label="Kierowca"
      name="driver_ids"
      selected={selected_driver_ids}
      onChange={handleChange}
      collecion={drivers}
    />

    <SelectFilter
      label="Miesiąc"
      name="month"
      selected={selected_month}
      onChange={handleChange}
      collecion={months}
      includeBlank={false}
    />

    <SelectFilter
      label="Rok"
      name="year"
      selected={selected_year}
      onChange={handleChange}
      collecion={years}
      includeBlank={false}
    />
  </div>
)

export default CustomToolbar;
