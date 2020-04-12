import React, { FunctionComponent } from 'react';
import { useField } from 'react-final-form';
import { FormLabel, Input } from '@chakra-ui/core';
import Control from './control';
import Error from './error';

type Props = {
  name: string;
  label: string;
  required?: boolean;
};

const InputControl: FunctionComponent<Props> = ({ name, label, required = false }) => {
  const { input, meta } = useField(name);
  return (
    <Control name={name} my={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Input {...input} isRequired={required} isInvalid={meta.error && meta.touched} id={name} placeholder={label} />
      <Error name={name} />
    </Control>
  );
};

export default InputControl;
