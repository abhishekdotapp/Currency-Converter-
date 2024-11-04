import { useState, useEffect } from 'react';
import { InputBox } from './components';
import useCurrencyInfo from './hooks/useCurrencyInfo';

function App() {
  const [amount, setAmount] = useState(0); // Set initial amount to 0
  const [from, setFrom] = useState(() => localStorage.getItem('from') || "usd");
  const [to, setTo] = useState(() => localStorage.getItem('to') || "inr");
  const [convertedAmount, setConvertedAmount] = useState(0); // Set initial converted amount to 0
  const [conversionHistory, setConversionHistory] = useState(() => {
    const savedHistory = localStorage.getItem('conversionHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const currencyInfo = useCurrencyInfo(from);
  const options = Object.keys(currencyInfo);

  useEffect(() => {
    localStorage.setItem('from', from);
    localStorage.setItem('to', to);
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
  }, [from, to, conversionHistory]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  const convert = () => {
    const newConvertedAmount = amount * currencyInfo[to];
    setConvertedAmount(newConvertedAmount);

    // Update conversion history
    const newEntry = { from: `${amount} ${from.toUpperCase()}`, to: `${newConvertedAmount.toFixed(2)} ${to.toUpperCase()}` };
    
    setConversionHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newEntry];
      return updatedHistory.slice(-5); // Keep only the last 5 entries
    });
  };

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    convert(); // Automatically convert when the amount changes
  };

  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1694501898553-5e8ee216012c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=60')`,
      }}
    >
      <div className="w-full">
        <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="w-full mb-1">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={handleAmountChange} // Use the updated handler
              />
            </div>
            <div className="relative w-full h-0.5">
              <button
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                onClick={swap}
              >
                swap
              </button>
            </div>
            <div className="w-full mt-1 mb-4">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisable
              />
            </div>
          </form>

          {/* Conversion History */}
          <div className="mt-5">
            <h2 className="text-lg font-bold">Previous Conversions</h2>
            <ul className="list-disc pl-5">
              {conversionHistory.map((entry, index) => (
                <li key={index}>
                  {entry.from} = {entry.to}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
