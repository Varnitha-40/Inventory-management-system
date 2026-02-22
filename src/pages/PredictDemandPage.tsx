import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';

const PredictDemand = () => {
  // Sample data - in a real app, this would come from your AI/ML backend
  const samplePredictionData = [
    { day: '1', actual: 65, predicted: 62 },
    { day: '2', actual: 68, predicted: 67 },
    { day: '3', actual: 75, predicted: 73 },
    { day: '4', actual: 71, predicted: 70 },
    { day: '5', actual: 80, predicted: 82 },
    { day: '6', actual: 85, predicted: 87 },
    { day: '7', actual: 90, predicted: 88 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <LineChartIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Predict Demand</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Demand Forecast</h2>
          <div className="w-full h-[400px]">
            <LineChart
              width={800}
              height={400}
              data={samplePredictionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3B82F6" name="Actual Demand" />
              <Line type="monotone" dataKey="predicted" stroke="#10B981" name="Predicted Demand" />
            </LineChart>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Controls</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                Select Product
              </label>
              <select
                id="product"
                name="product"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>Product A</option>
                <option>Product B</option>
                <option>Product C</option>
              </select>
            </div>

            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                Prediction Period (Days)
              </label>
              <input
                type="number"
                id="days"
                name="days"
                min="1"
                max="90"
                defaultValue="7"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confidence" className="block text-sm font-medium text-gray-700">
                Confidence Level
              </label>
              <select
                id="confidence"
                name="confidence"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="0.95">95%</option>
                <option value="0.90">90%</option>
                <option value="0.85">85%</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Prediction
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-medium text-blue-900">Prediction Summary</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Estimated Demand:</span> 88 units
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Confidence Interval:</span> ±5 units
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Trend:</span> Increasing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictDemand;