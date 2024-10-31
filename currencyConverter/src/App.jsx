import { useState } from 'react'
import { InputBox } from './components'
import useCurrencyInfo from './hooks/useCurrencyInfo'


function App() {

  const [amount, setAmount] = useState()
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState()
  const [conversionHistory, setConversionHistory] = useState([]);
  
  const currencyInfo = useCurrencyInfo(from)

  const options = Object.keys(currencyInfo)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])
    setConversionHistory([...conversionHistory, {
      from: from,
      to: to,
      amount: amount,
      convertedAmount: convertedAmount
    }]);
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'amount') {
      setAmount(value);
    }
  };

  const saveData = () => {
    localStorage.setItem('currencyData', JSON.stringify({
      amount,
      from,
      to,
      convertedAmount,
      conversionHistory
    }));
  };

  const loadData = () => {
    const storedData = localStorage.getItem('currencyData');
    if (storedData) {
      const { amount, from, to, convertedAmount, conversionHistory } = JSON.parse(storedData);
      setAmount(amount);
      setFrom(from);
      setTo(to);
      setConvertedAmount(convertedAmount);
      setConversionHistory(conversionHistory);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('beforeunload', saveData);
    return () => window.removeEventListener('beforeunload', saveData); // cleanup
  }, []);
  
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
              convert()

            }}
          >
            <div className="w-full mb-1">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(amount) => setAmount(amount)}
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
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
          <div   
 className="w-full mt-4">
            <h2>Conversion History</h2>
            <ul>
              {conversionHistory.map((historyItem, index) => (
                <li key={index}>
                  {historyItem.amount} {historyItem.from} = {historyItem.convertedAmount} {historyItem.to}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
