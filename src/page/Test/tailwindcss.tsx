import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BASE_URL = import.meta.env.VITE_BASE_URL;
function TodoList() {
  const { t } = useTranslation('page.test.todoList');
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'], // 1. Unique Key (dependency array)
    queryFn: async () => {
      // 2. Function to fetch data (must return Promise)
      const res = await axios.get(`${BASE_URL}:3001/0`);
      return res.data;
    },
    // staleTime: 10000, // Optional: Set expiration time individually
  });

  if (isPending) return <span>{t('loading')}</span>;
  if (isError) return <span>{t('errorPrefix', { message: error.message })}</span>;

  return (
    <ul>
      {data.data.map((todo: { id: number; name: string }) => (
        <li key={todo.id}>
          {todo.id}. {todo.name}
        </li>
      ))}
    </ul>
  );
}
export default TodoList;
