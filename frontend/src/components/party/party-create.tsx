import React, { useCallback, useContext } from 'react';
import { mutate } from 'swr';
import { Form } from 'react-final-form';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, ButtonGroup } from '@chakra-ui/core';

import InputControl from '../form/input-control';
import config from '../../config';
import fetcher from '../../util/fetcher';
import { Party } from '../../interfaces';
import { AuthContext } from '../../contexts/AuthContext';
import useLocalStorage from '../../hooks/use-localstorage';

const PartyCreate: React.FunctionComponent = ({ ...props }) => {
  const { accessToken } = useContext(AuthContext);

  const [clientUuid, setClientUuid] = useLocalStorage('clientUuid');
  if (!clientUuid) {
    setClientUuid(uuidv4());
  }

  const handleFormSubmit = useCallback(
    async (values) => {
      await mutate(`${config.apiBaseUrl}/parties`, async (parties: Party[]) => {
        const party = await fetcher(`${config.apiBaseUrl}/parties`, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            Authorization: `${accessToken.token_type} ${accessToken.access_token}`,
          },
        });
        return [party, ...parties];
      });
    },
    [accessToken],
  );
  return (
    <Form onSubmit={handleFormSubmit}>
      {({ handleSubmit, form, submitting, pristine }) => (
        <Box
          as="form"
          width="100%"
          alignSelf="flex-start"
          padding="16px"
          borderRadius="2px"
          flex="1"
          backgroundColor="#ffffff"
          onSubmit={handleSubmit}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...props}
        >
          <InputControl name="name" label="Name" required />
          <InputControl name="topic" label="Topic" required />
          <ButtonGroup spacing={4}>
            <Button isLoading={submitting} loadingText="Submitting" variantColor="green" type="submit">
              Create Party
            </Button>
            <Button variantColor="teal" variant="outline" onClick={form.reset} isDisabled={submitting || pristine}>
              Reset
            </Button>
          </ButtonGroup>
        </Box>
      )}
    </Form>
  );
};
export default PartyCreate;
