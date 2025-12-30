// src/App.tsx
import { useBearStore } from './store';

function App() {
  // 就像用 useState 一樣把東西拿出來
  const bears = useBearStore((state) => state.bears);
  const increase = useBearStore((state) => state.increase);

  return (
    <div>
      <h1>現在有 {bears} 隻熊</h1>
      <button onClick={increase}>增加一隻熊</button>
    </div>
  );
}
export default App;
