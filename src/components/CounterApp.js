import { useState, useEffect } from 'react';

const CounterApp = () => {
  // 初始化状态，从localStorage读取数据或使用默认值
  const [counters, setCounters] = useState(() => {
    const saved = localStorage.getItem('todayCounters');
    const initialValue = saved ? JSON.parse(saved) : { 贪: 0, 嗔: 0, 痴: 0 };
    return initialValue;
  });

  // 从localStorage读取历史数据
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    const initialValue = saved ? JSON.parse(saved) : {
      average: { 贪: 0, 嗔: 0, 痴: 0 },
      yesterday: { 贪: 0, 嗔: 0, 痴: 0 }
    };
    return initialValue;
  });

  // 在每天午夜更新统计数据
  useEffect(() => {
    const updateDaily = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const timeUntilMidnight = tomorrow - now;

      // 设置定时器在午夜触发
      const timer = setTimeout(() => {
        // 保存昨天的数据
        setStats(prevStats => ({
          ...prevStats,
          yesterday: { ...counters },
          average: calculateNewAverage(prevStats.average, counters)
        }));
        // 重置今天的计数器
        setCounters({ 贪: 0, 嗔: 0, 痴: 0 });
      }, timeUntilMidnight);

      return () => clearTimeout(timer);
    };

    updateDaily();
  }, [counters]);

  // 计算新的平均值
  const calculateNewAverage = (oldAverage, newCounts) => {
    const result = {};
    for (const key in oldAverage) {
      result[key] = Math.round((oldAverage[key] * 29 + newCounts[key]) / 30);
    }
    return result;
  };

  // 当计数器更新时保存到localStorage
  useEffect(() => {
    localStorage.setItem('todayCounters', JSON.stringify(counters));
  }, [counters]);

  // 当统计数据更新时保存到localStorage
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const incrementCounter = (type) => {
    setCounters(prevCounters => ({
      ...prevCounters,
      [type]: prevCounters[type] + 1
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">【禅心】贪嗔痴计数器</h1>
      <div className="space-y-4">
        {["贪", "嗔", "痴"].map((type) => (
          <div key={type} className="flex items-center space-x-4">
            <button
              onClick={() => incrementCounter(type)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {type}
            </button>
            <span className="text-lg">当前计数: {counters[type]}</span>
            <span className="text-lg">过往平均: {stats.average[type]}</span>
            <span className="text-lg">昨日统计: {stats.yesterday[type]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterApp;