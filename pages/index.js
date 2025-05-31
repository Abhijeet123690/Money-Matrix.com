import CandlestickChart from '../components/CandlestickChart';

// Inside your component:
{selectedStock && (
  <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
    {/* Stock info header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
        <p className="text-slate-400">{selectedStock.name}</p>
      </div>
      
      {quoteData?.GlobalQuote && (
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-3xl font-bold">
            ${parseFloat(quoteData.GlobalQuote['05. price']).toFixed(2)}
          </div>
          <div className={`text-lg ${parseFloat(quoteData.GlobalQuote['10. change percent'].replace('%', '')) >= 0 
            ? 'text-green-500' : 'text-red-500'}`}>
            {quoteData.GlobalQuote['09. change']} ({quoteData.GlobalQuote['10. change percent']})
          </div>
        </div>
      )}
    </div>
    
    {/* Replace ChartSection with CandlestickChart */}
    <CandlestickChart data={dailyData} />
    
    {/* Volume indicator */}
    <div className="mt-4 text-sm text-slate-400">
      {dailyData?.['Meta Data'] && (
        <div>
          Last Updated: {dailyData['Meta Data']['3. Last Refreshed']} | 
          Time Zone: {dailyData['Meta Data']['5. Time Zone']}
        </div>
      )}
    </div>
  </div>
)}
