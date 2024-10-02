import { ChartWrapper } from './components/ChartWrapper';

const App = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md text-center'>
        <h1 className='text-2xl text-black font-bold mb-4'>
          Chart Data Visualization
        </h1>
        <ChartWrapper />
      </div>
    </div>
  );
};

export default App;
