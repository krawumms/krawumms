import * as React from 'react';
import Link from 'next/link';

import { Todo } from '../interfaces';

type Props = {
  data: Todo;
};

const ListItem: React.FunctionComponent<Props> = ({ data }) => (
  <Link href="/todos/[id]" as={`/todos/${data.id}`}>
    <a>
      {data.id}: {data.text}
    </a>
  </Link>
);

export default ListItem;
