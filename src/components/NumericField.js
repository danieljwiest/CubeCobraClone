import React from 'react';
import PropTypes from 'prop-types';

import { Input, InputGroup, InputGroupText } from 'reactstrap';

const NumericField = ({ name, humanName, placeholder, valueOp, value, onChange, ...props }) => (
  <InputGroup className="mb-3" {...props}>
    <InputGroupText>{humanName}</InputGroupText>
    <Input type="select" id={`${name}Op`} name={`${name}Op`} value={valueOp} onChange={onChange}>
      <option value="=">equal to</option>
      <option value="<">less than</option>
      <option value=">">greater than</option>
      <option value="<=">less than or equal to</option>
      <option value=">=">greater than or equal to</option>
      <option value="!=">not equal to</option>
    </Input>
    <Input type="text" name={name} placeholder={placeholder} value={value} onChange={onChange} />
  </InputGroup>
);

NumericField.propTypes = {
  name: PropTypes.string.isRequired,
  humanName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  valueOp: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumericField;
