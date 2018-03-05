import React from 'react'

const SelectFilter = ({ label, name, selected, onChange, collecion, includeBlank=true }) => {
  return(
    <label>{label}
      <select name={name} value={selected} onChange={onChange} className="form-control input-sm">
        {includeBlank && <option value=""></option>}
        {collecion.map(object =>
          <option key={object.id} value={object.id}>{object.name}</option>
        )};
      </select>
    </label>
  )
}

export default SelectFilter;
