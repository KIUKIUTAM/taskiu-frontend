import React from 'react';
const TransitionComparison: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-gray-100 min-h-screen">
      {/* 1. transition - 通用過渡 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">1. transition (推薦)</h3>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 hover:shadow-lg hover:scale-105">
          Hover Me - transition
        </button>
      </div>

      {/* 2. transition-all - 全部過渡 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">2. transition-all (性能較差)</h3>
        <button className="px-6 py-3 bg-purple-500 text-white rounded-lg transition-all hover:bg-purple-600 hover:shadow-lg hover:scale-105 hover:rotate-2">
          Hover Me - transition-all
        </button>
      </div>

      {/* 3. transition-colors - 只有顏色 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">3. transition-colors (只顏色變化)</h3>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg transition-colors hover:bg-green-600 hover:shadow-lg hover:scale-105">
          Hover Me - 只有顏色會過渡
        </button>
      </div>

      {/* 4. transition-transform - 只有變形 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">4. transition-transform (只變形)</h3>
        <button className="px-6 py-3 bg-red-500 text-white rounded-lg transition-transform hover:bg-red-600 hover:shadow-lg hover:scale-110 hover:rotate-3">
          Hover Me - 只有縮放旋轉會過渡
        </button>
      </div>

      {/* 5. transition-opacity - 只有透明度 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">5. transition-opacity (只透明度)</h3>
        <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg transition-opacity hover:opacity-70">
          Hover Me - transition-opacity
        </button>
      </div>

      {/* 6. transition-shadow - 只有陰影 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">6. transition-shadow (只陰影)</h3>
        <button className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow transition-shadow hover:shadow-2xl">
          Hover Me - transition-shadow
        </button>
      </div>

      {/* 7. 組合使用 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">7. 組合使用 (最佳實踐)</h3>
        <button className="px-6 py-3 bg-indigo-500 text-white rounded-lg transition-colors duration-300 hover:bg-indigo-600">
          顏色過渡 300ms
        </button>
      </div>

      {/* 8. 多重組合 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">8. 多重過渡</h3>
        <button className="px-6 py-3 bg-teal-500 text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-teal-600 hover:scale-110 hover:rotate-6 hover:shadow-2xl">
          複雜過渡效果
        </button>
      </div>
    </div>
  );
};

export default TransitionComparison;
