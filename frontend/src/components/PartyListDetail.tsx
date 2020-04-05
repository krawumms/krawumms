import * as React from 'react';

import { Party } from '../interfaces';

type ListDetailProps = {
  item: Party;
};

const PartyListDetail: React.FunctionComponent<ListDetailProps> = ({ item: party }) => (
  <div>
    <h1>Detail for {party.name}</h1>
    <p>ID: {party.id}</p>
  </div>
);

export default PartyListDetail;
