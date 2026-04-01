import { useEffect, useState } from "react";

const LoadingPage = () => {
  const [heights, setHeights] = useState([40, 70, 40]);

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    const animate = (index: number, delay: number) => {
      const interval = setInterval(() => {
        setHeights((prev) => {
          const newHeights = [...prev];
          const time = Date.now() / 400 + delay;
          newHeights[index] = 20 + Math.abs(Math.sin(time)) * 80;
          return newHeights;
        });
      }, 16);
      intervals.push(interval);
    };

    animate(0, 0);
    animate(1, Math.PI / 3);
    animate(2, (2 * Math.PI) / 3);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#ffffff",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "80px",
        }}
      >
        {heights.map((height, index) => (
          <div
            key={index}
            style={{
              width: "16px",
              height: `${height * 0.67}px`,
              backgroundColor: "#000000",
              borderRadius: "3px",
              transition: "height 0.05s ease-in-out",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;
