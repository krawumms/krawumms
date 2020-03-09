import * as React from 'react';

import { Todo } from '../interfaces';

type ListDetailProps = {
  item: Todo;
};

const ListDetail: React.FunctionComponent<ListDetailProps> = ({ item: todo }) => (
  <div>
    <h1>Detail for {todo.text}</h1>
    <p>ID: {todo.id}</p>
    <p>done: {todo.done}</p>
  </div>
);

export default ListDetail;
