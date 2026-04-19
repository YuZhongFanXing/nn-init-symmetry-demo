import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface NetworkState {
  step: number;
  neurons: any[];
  explanation: string;
}

interface TheoryPanelProps {
  state: NetworkState;
  mode: 'symmetric' | 'asymmetric';
}

const TheoryPanel: React.FC<TheoryPanelProps> = ({ state, mode }) => {
  const symmetricExplanations = [
    {
      title: '对称初始状态',
      description: '所有神经元使用相同的权重初始化',
      formula: 'w_A = w_B = [0.2, 0.3, 0.4]',
      problem: '问题：无法区分不同的神经元',
    },
    {
      title: '输出同质化',
      description: '相同的权重导致相同的输出',
      formula: 'z_A = z_B = 0.9',
      problem: '问题：网络无法学习多样化特征',
    },
    {
      title: '梯度同质化',
      description: '相同的输出导致相同的梯度',
      formula: '∂L/∂w_A = ∂L/∂w_B',
      problem: '问题：无法独立更新权重',
    },
    {
      title: '对称性保持',
      description: '权重更新后仍然相同',
      formula: 'w_A = w_B（始终）',
      problem: '问题：陷入对称性陷阱',
    },
    {
      title: '训练失败',
      description: '网络无法充分利用容量',
      formula: '模型退化为单个神经元',
      problem: '问题：无法收敛到最优解',
    },
  ];

  const asymmetricExplanations = [
    {
      title: '非对称初始状态',
      description: '神经元使用不同的随机权重',
      formula: 'w_A ≠ w_B',
      problem: '优势：打破对称性',
    },
    {
      title: '输出多样化',
      description: '不同的权重导致不同的输出',
      formula: 'z_A = 0.9, z_B = 1.1',
      problem: '优势：网络可学习不同特征',
    },
    {
      title: '梯度多样化',
      description: '不同的输出导致不同的梯度',
      formula: '∂L/∂w_A ≠ ∂L/∂w_B',
      problem: '优势：独立学习机制',
    },
    {
      title: '独立演化',
      description: '权重更新后保持不同',
      formula: 'w_A ≠ w_B（演化）',
      problem: '优势：充分利用模型容量',
    },
    {
      title: '训练成功',
      description: '网络有效学习和收敛',
      formula: '学习丰富的表示',
      problem: '优势：达到最优性能',
    },
  ];

  const explanations = mode === 'symmetric' ? symmetricExplanations : asymmetricExplanations;
  const currentExplanation = explanations[state.step] || explanations[0];

  return (
    <div className="space-y-4">
      {/* Main Explanation Card */}
      <motion.div
        key={`explanation-${state.step}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2">
            {currentExplanation.title}
          </h3>
          <p className="text-sm text-slate-700 mb-3">
            {currentExplanation.description}
          </p>
          <div className="bg-white p-3 rounded border border-slate-200 mb-3">
            <code className="text-xs font-mono text-slate-700">
              {currentExplanation.formula}
            </code>
          </div>
          <div
            className={`p-2 rounded text-sm font-semibold ${
              mode === 'symmetric'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {currentExplanation.problem}
          </div>
        </Card>
      </motion.div>

      {/* Step Indicator */}
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs font-semibold text-slate-600 mb-2">
          步骤 {state.step + 1} / {explanations.length}
        </div>
        <div className="flex gap-1">
          {explanations.map((_, idx) => (
            <motion.div
              key={`step-${idx}`}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx <= state.step
                  ? mode === 'symmetric'
                    ? 'bg-red-500'
                    : 'bg-green-500'
                  : 'bg-slate-200'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: idx * 0.05 }}
            />
          ))}
        </div>
      </div>

      {/* Key Points */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-3 text-sm">
          {mode === 'symmetric' ? '❌ 问题总结' : '✅ 解决方案'}
        </h4>
        <ul className="space-y-2 text-xs text-slate-700">
          {mode === 'symmetric' ? (
            <>
              <li>• 神经元权重始终相同</li>
              <li>• 输出完全相同</li>
              <li>• 梯度完全相同</li>
              <li>• 无法学习多样化特征</li>
              <li>• 模型容量被浪费</li>
            </>
          ) : (
            <>
              <li>• 使用小的随机值初始化</li>
              <li>• 神经元产生不同输出</li>
              <li>• 梯度不同，独立更新</li>
              <li>• 学习丰富的特征表示</li>
              <li>• 充分利用模型容量</li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default TheoryPanel;
