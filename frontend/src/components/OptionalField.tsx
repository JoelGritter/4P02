import classes from '*.module.css';
import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  OutlinedInput,
} from '@material-ui/core';
import React from 'react';

interface OptionalFieldProps {
  component: any;
  setValue: any;
  value: any;
  [key: string]: any;
  defaultValue: any;
  label: string;
}

const OptionalField: React.FC<OptionalFieldProps> = ({
  component,
  setValue,
  value,
  optionLabel,
  children,
  defaultValue,
  ...otherProps
}) => {
  const Component = component;
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!value}
            onChange={() => {
              setValue(value ? null : defaultValue);
            }}
          />
        }
        label={optionLabel}
      />
      {value && (
        <Component
          value={value}
          {...otherProps}
          onChange={(e: any) => {
            setValue(e.target.value);
          }}
          {...children}
        ></Component>
      )}
    </>
  );
};

export default OptionalField;
