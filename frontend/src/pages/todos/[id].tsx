import * as React from 'react';
import { useRouter } from 'next/router';
import { NextPage, NextPageContext } from 'next';
import useSWR from 'swr';

import { Todo } from '../../interfaces';
import fetcher from '../../util/fetcher';

type Props = {
  initialData?: Todo;
};

const TodoPage: NextPage<Props> = ({ initialData }) => {
  const { query } = useRouter();
  const { id } = query;
  const { data, error } = useSWR<Todo>(`http://localhost:6011/todos/${id}`, fetcher, { initialData });

  return (
    <>
      {error && <div>failed to load</div>}
      {!data && <div>loading...</div>}
      {data && !error && <div>{data?.text}</div>}
    </>
  );
};

TodoPage.getInitialProps = async ({ query }: NextPageContext) => {
  const { id } = query;
  const data = await fetcher(`http://localhost:6011/todos/${id}`);
  return { initialData: data };
};

export default TodoPage;
