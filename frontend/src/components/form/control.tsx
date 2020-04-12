import React, { FunctionComponent } from 'react';
import { FormControl } from '@chakra-ui/core';
import { useField } from 'react-final-form';

type Props = {
  name: string;
  my: number;
};

const Control: FunctionComponent<Props> = ({ name, ...rest }) => {
  const {
    meta: { error, touched },
  } = useField(name, { subscription: { touched: true, error: true } });
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <FormControl {...rest} isInvalid={error && touched} />;
};

export default Control;
