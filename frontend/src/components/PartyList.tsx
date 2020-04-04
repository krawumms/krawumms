import * as React from 'react';

import PartyListItem from './PartyListItem';
import { Party } from '../interfaces';

type Props = {
  items: Party[];
};

const List: React.FunctionComponent<Props> = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <PartyListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;
