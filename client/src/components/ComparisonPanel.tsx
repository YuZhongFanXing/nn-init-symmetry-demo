import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ComparisonPanelProps {
  currentStep: number;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ currentStep }) => {
  const comparisons = [
    {
      aspect: '权重初始化',
      symmetric: '完全相同',
      asymmetric: '随机不同',
    },
    {
      aspect: '前向传播输出',
      symmetric: '完全相同',
      asymmetric: '不同',
    },
    {
      aspect: '反向传播梯度',
      symmetric: '完全相同',
      asymmetric: '不同',
    },
    {
      aspect: '权重更新',
      symmetric: '始终相同',
      asymmetric: '独立演化',
    },
    {
      aspect: '学习能力',
      symmetric: '无法学习',
      asymmetric: '充分学习',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-4 bg-white border-slate-200">
        <h4 className="font-bold text-slate-900 mb-3 text-sm">
          对称 vs 非对称
        </h4>
        <div className="space-y-2 text-xs">
          {comparisons.map((comp, idx) => (
            <motion.div
              key={`comp-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded border border-slate-200"
            >
              <div className="font-semibold text-slate-700">
                {comp.aspect}
              </div>
              <div className="text-red-600 font-mono">
                {comp.symmetric}
              </div>
              <div className="text-green-600 font-mono">
                {comp.asymmetric}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ComparisonPanel;
