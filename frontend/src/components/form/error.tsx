import React, { FunctionComponent } from 'react';
import { FormErrorMessage } from '@chakra-ui/core';
import { useField } from 'react-final-form';

type Props = {
  name: string;
};

const Error: FunctionComponent<Props> = ({ name }) => {
  const {
    meta: { error },
  } = useField(name, { subscription: { error: true } });
  return <FormErrorMessage>{error}</FormErrorMessage>;
};

export default Error;
