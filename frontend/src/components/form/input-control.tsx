import React, { FunctionComponent } from 'react';
import { useField } from 'react-final-form';
import { FormLabel, Input } from '@chakra-ui/core';
import Control from './control';
import Error from './error';

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  variant?: 'outline' | 'unstyled' | 'flushed' | 'filled' | undefined;
  placeholder?: string;
};

const InputControl: FunctionComponent<Props> = ({
  placeholder,
  name,
  label,
  variant,
  required = false,
  ...inputProps
}) => {
  const { input, meta } = useField(name);
  return (
    <Control name={name} my={4}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...inputProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...input}
        variant={variant}
        isRequired={required}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={label || placeholder}
      />
      <Error name={name} />
    </Control>
  );
};

export default InputControl;
