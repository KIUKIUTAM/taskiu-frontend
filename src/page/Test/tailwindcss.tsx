import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
function TodoList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'], // 1. 唯一的 Key (依賴陣列)
    queryFn: async () => {
      // 2. 獲取資料的函式 (必須回傳 Promise)
      const res = await axios.get(`${BASE_URL}:3001/0`);
      return res.data;
    },
    // staleTime: 10000, // 可選：個別設定過期時間
  });

  if (isPending) return <span>載入中...</span>;
  if (isError) return <span>發生錯誤: {error.message}</span>;

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
