// components/CandlestickChart.js
import { useEffect, useRef } from 'react';
import {
  createChart,
  CrosshairMode,
  PriceScaleMode,
  TimeScale,
  PriceFormat
} from 'lightweight-charts';

export default function CandlestickChart({ data }) {
  const chartContainerRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !data['Time Series (Daily)']) return;

    // Create chart if not exists
    if (!chartInstance.current) {
      chartInstance.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          backgroundColor: '#0f172a',
          textColor: '#cbd5e1',
          fontSize: 12,
          fontFamily: 'Inter, -apple-system, sans-serif',
        },
        grid: {
          vertLines: { color: '#1e293b' },
          horzLines: { color: '#1e293b' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#3b82f6',
            labelBackgroundColor: '#3b82f6',
          },
          horzLine: {
            color: '#3b82f6',
            labelBackgroundColor: '#3b82f6',
          },
        },
        timeScale: {
          borderColor: '#1e293b',
          timeVisible: true,
          secondsVisible: false,
          fixLeftEdge: true,
        },
        watermark: {
          visible: true,
          fontSize: 12,
          horzAlign: 'left',
          vertAlign: 'top',
          color: 'rgba(203, 213, 225, 0.5)',
          text: 'Money Matrix • Real-time Analysis',
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          mouseWheel: true,
          pinch: true,
          axisPressedMouseMove: true,
          axisDoubleClickReset: true,
        },
      });
    }

    const chart = chartInstance.current;
    chart.removeAllSeries();

    // Process OHLC data
    const timeSeries = data['Time Series (Daily)'];
    const seriesData = Object.keys(timeSeries)
      .sort()
      .map((date) => ({
        time: date,
        open: parseFloat(timeSeries[date]['1. open']),
        high: parseFloat(timeSeries[date]['2. high']),
        low: parseFloat(timeSeries[date]['3. low']),
        close: parseFloat(timeSeries[date]['4. close']),
        volume: parseFloat(timeSeries[date]['5. volume']),
      }))
      .slice(-90); // Last 90 days

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: 'rgba(239, 68, 68, 0.7)',
      wickUpColor: 'rgba(16, 185, 129, 0.7)',
      priceScaleId: 'price',
    });

    candleSeries.setData(seriesData);

    // Calculate RSI
    const rsiData = calculateRSI(seriesData, 14);
    
    // Create RSI pane
    const rsiPane = chart.addPane({
      height: 120,
      vertAlign: 'bottom',
    });

    // Add RSI series
    const rsiSeries = chart.addLineSeries({
      pane: rsiPane,
      color: '#8b5cf6',
      lineWidth: 2,
      priceScaleId: 'rsi',
      title: 'RSI (14)',
    });

    rsiSeries.setData(rsiData);

    // Configure RSI price scale
    rsiPane.applyOptions({
      priceScale: {
        position: 'right',
        mode: PriceScaleMode.IndexedTo100,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    // Add RSI reference lines
    rsiSeries.createPriceLine({
      price: 70,
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      axisLabelVisible: true,
      title: 'Overbought',
    });

    rsiSeries.createPriceLine({
      price: 30,
      color: '#10b981',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      axisLabelVisible: true,
      title: 'Oversold',
    });

    // Handle window resize
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [data]);

  // RSI calculation function
  const calculateRSI = (data, period) => {
    const rsiData = [];
    let gains = 0;
    let losses = 0;
    
    // Calculate initial averages
    for (let i = 1; i <= period; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) gains += change;
      else losses -= change;
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    // Calculate subsequent RSIs
    for (let i = period; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      let currentGain = 0;
      let currentLoss = 0;
      
      if (change >= 0) currentGain = change;
      else currentLoss = -change;
      
      avgGain = (avgGain * (period - 1) + currentGain) / period;
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
      
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      rsiData.push({
        time: data[i].time,
        value: rsi,
      });
    }
    
    return rsiData;
  };

  return (
    <div
      ref={chartContainerRef}
      className="w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-800"
    />
  );
}
