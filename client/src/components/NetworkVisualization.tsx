import React from 'react';
import { motion } from 'framer-motion';

interface NeuronState {
  id: string;
  weights: number[];
  bias: number;
  output: number;
  gradient?: number;
}

interface NetworkVisualizationProps {
  neurons: NeuronState[];
  mode: 'symmetric' | 'asymmetric' | 'internal-symmetric';
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  neurons,
  mode,
}) => {
  const getWeightColor = (weight: number) => {
    const intensity = Math.min(Math.abs(weight) * 2, 1);
    if (weight > 0) {
      return `rgba(59, 130, 246, ${intensity})`; // Blue for positive
    } else {
      return `rgba(239, 68, 68, ${intensity})`; // Red for negative
    }
  };

  const getOutputColor = (output: number) => {
    const normalized = Math.min(Math.abs(output), 1);
    return `rgba(34, 197, 94, ${normalized})`; // Green
  };

  const isSameWeights = (n1: NeuronState, n2: NeuronState) => {
    return JSON.stringify(n1.weights) === JSON.stringify(n2.weights);
  };

  const isSameOutput = (n1: NeuronState, n2: NeuronState) => {
    return Math.abs(n1.output - n2.output) < 0.01;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Input Layer */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-slate-600 mb-2">输入层</div>
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`input-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-12 h-12 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center"
            >
              <span className="text-xs font-semibold text-blue-700">x{i}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connection Lines */}
      <div className="h-12 flex items-center justify-center text-slate-400">
        <div className="w-0.5 h-full bg-slate-300"></div>
      </div>

      {/* Hidden Layer */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-slate-600 mb-4">隐藏层</div>
        <div className="flex gap-8">
          {neurons.map((neuron, idx) => {
            const isSame =
              neurons.length > 1 &&
              isSameWeights(neuron, neurons[(idx + 1) % neurons.length]);
            const outputSame =
              neurons.length > 1 &&
              isSameOutput(neuron, neurons[(idx + 1) % neurons.length]);

            return (
              <motion.div
                key={neuron.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Neuron Circle */}
                <motion.div
                  animate={{
                    boxShadow: outputSame
                      ? `0 0 20px ${getOutputColor(neuron.output)}`
                      : 'none',
                  }}
                  className="w-16 h-16 rounded-full border-3 flex items-center justify-center font-bold text-lg relative"
                  style={{
                    borderColor: isSame ? '#ef4444' : '#3b82f6',
                    backgroundColor: getOutputColor(neuron.output),
                  }}
                >
                  <span className="text-white">{neuron.id}</span>
                  {isSame && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ⚠
                    </div>
                  )}
                </motion.div>

                {/* Weights Display */}
                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200 w-32">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    权重
                  </div>
                  <div className="space-y-1">
                    {neuron.weights.map((w, i) => (
                      <motion.div
                        key={`weight-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.abs(w) * 100}%`,
                            }}
                            style={{
                              backgroundColor: getWeightColor(w),
                            }}
                            className="h-full"
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-600 w-10">
                          {w.toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">
                      偏置: {neuron.bias.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Output Display */}
                <div className="mt-3 bg-green-50 p-2 rounded-lg border border-green-200 w-32 text-center">
                  <div className="text-xs font-semibold text-green-700">
                    输出: {neuron.output.toFixed(2)}
                  </div>
                  {neuron.gradient !== undefined && (
                    <div className="text-xs text-green-600 mt-1">
                      梯度: {neuron.gradient.toFixed(2)}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Symmetry Warning */}
        {neurons.length > 1 && isSameWeights(neurons[0], neurons[1]) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-center"
          >
            <p className="text-sm font-semibold text-red-700">
              ⚠️ 检测到对称性：所有神经元权重相同
            </p>
            <p className="text-xs text-red-600 mt-1">
              这会导致网络无法学习多样化的特征表示
            </p>
          </motion.div>
        )}
      </div>

      {/* Connection Lines */}
      <div className="h-12 flex items-center justify-center text-slate-400">
        <div className="w-0.5 h-full bg-slate-300"></div>
      </div>

      {/* Output Layer */}
      <div>
        <div className="text-sm font-semibold text-slate-600 mb-2">输出层</div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-14 h-14 bg-purple-100 border-2 border-purple-500 rounded-full flex items-center justify-center"
        >
          <span className="text-xs font-semibold text-purple-700">y</span>
        </motion.div>
      </div>
    </div>
  );
};

export default NetworkVisualization;
