import * as React from 'react';
import Link from 'next/link';

import { Party } from '../interfaces';

type Props = {
  data: Party;
};

const ListItem: React.FunctionComponent<Props> = ({ data }) => (
  <Link href="/parties/[id]" as={`/parties/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;
