import { Checkbox, FormControlLabel } from '@material-ui/core';
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
          onChange={(d: any) => {
            setValue(d);
          }}
          {...children}
        ></Component>
      )}
    </>
  );
};

export default OptionalField;
