import React, { useState, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NetworkVisualization from '@/components/NetworkVisualization';
import TheoryPanel from '@/components/TheoryPanel';
import ComparisonPanel from '@/components/ComparisonPanel';
import AnimationControls from '@/components/AnimationControls';

/**
 * Home Page - Neural Network Initialization Symmetry Problem
 * 
 * Design: Educational Clarity with Interactive Depth
 * - Left panel (60%): Network visualization with animation
 * - Right panel (40%): Theory explanation and comparison
 * - Bottom: Animation controls
 */

export type InitializationMode = 'symmetric' | 'asymmetric' | 'internal-symmetric';

interface NetworkState {
  step: number;
  neurons: NeuronState[];
  explanation: string;
}

interface NeuronState {
  id: string;
  weights: number[];
  bias: number;
  output: number;
  gradient?: number;
}

// Generate network states for visualization
const generateNetworkStates = (): NetworkState[] => {
  const states: NetworkState[] = [];
  
  // Step 0: Initial state
  states.push({
    step: 0,
    neurons: [
      { id: 'A', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0, gradient: 0 },
      { id: 'B', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0, gradient: 0 },
    ],
    explanation: '第一步：对称的初始状态\n神经元A和B的权重完全相同：w_A = w_B = [0.2, 0.3, 0.4]',
  });

  // Step 1: Forward pass
  states.push({
    step: 1,
    neurons: [
      { id: 'A', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0.9, gradient: 0 },
      { id: 'B', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0.9, gradient: 0 },
    ],
    explanation: '第二步：前向传播——输出同质化\n由于权重相同，两个神经元产生相同的输出：z_A = z_B = 0.9',
  });

  // Step 2: Backward pass - gradient computation
  states.push({
    step: 2,
    neurons: [
      { id: 'A', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0.9, gradient: 0.15 },
      { id: 'B', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0.9, gradient: 0.15 },
    ],
    explanation: '第三步：反向传播——梯度同质化\n计算梯度：∂L/∂w_A = ∂L/∂z_A × ∂z_A/∂w_A\n由于输出相同，梯度也相同：∂L/∂w_A = ∂L/∂w_B',
  });

  // Step 3: Weight update
  states.push({
    step: 3,
    neurons: [
      { id: 'A', weights: [0.185, 0.285, 0.385], bias: 0.085, output: 0.9, gradient: 0.15 },
      { id: 'B', weights: [0.185, 0.285, 0.385], bias: 0.085, output: 0.9, gradient: 0.15 },
    ],
    explanation: '第四步：权重更新——对称性保持\n更新规则：w = w - α × ∂L/∂w\n由于梯度相同，权重更新后仍然相同：w_A = w_B',
  });

  // Step 4: Problem illustration
  states.push({
    step: 4,
    neurons: [
      { id: 'A', weights: [0.185, 0.285, 0.385], bias: 0.085, output: 0.9, gradient: 0.15 },
      { id: 'B', weights: [0.185, 0.285, 0.385], bias: 0.085, output: 0.9, gradient: 0.15 },
    ],
    explanation: '问题总结：对称性陷阱\n• 两个神经元始终产生相同的输出\n• 无法学习不同的特征表示\n• 网络退化为单个神经元的功能\n• 无法充分利用模型容量',
  });

  return states;
};

const generateAsymmetricStates = (): NetworkState[] => {
  const states: NetworkState[] = [];
  
  // Step 0: Initial state
  states.push({
    step: 0,
    neurons: [
      { id: 'A', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0, gradient: 0 },
      { id: 'B', weights: [0.5, 0.1, 0.2], bias: 0.3, output: 0, gradient: 0 },
    ],
    explanation: '第一步：非对称的初始状态\n神经元A和B的权重不同：w_A ≠ w_B\nw_A = [0.2, 0.3, 0.4], w_B = [0.5, 0.1, 0.2]',
  });

  // Step 1: Forward pass
  states.push({
    step: 1,
    neurons: [
      { id: 'A', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0.9, gradient: 0 },
      { id: 'B', weights: [0.5, 0.1, 0.2], bias: 0.3, output: 1.1, gradient: 0 },
    ],
    explanation: '第二步：前向传播——输出多样化\n神经元产生不同的输出：z_A = 0.9, z_B = 1.1\n网络可以学习不同的特征',
  });

  // Step 2: Backward pass
  states.push({
    step: 2,
    neurons: [
      { id: 'A', weights: [0.2, 0.3, 0.4], bias: 0.1, output: 0.9, gradient: 0.12 },
      { id: 'B', weights: [0.5, 0.1, 0.2], bias: 0.3, output: 1.1, gradient: 0.18 },
    ],
    explanation: '第三步：反向传播——梯度多样化\n梯度不同：∂L/∂w_A ≠ ∂L/∂w_B\n每个神经元可以独立学习',
  });

  // Step 3: Weight update
  states.push({
    step: 3,
    neurons: [
      { id: 'A', weights: [0.188, 0.288, 0.388], bias: 0.088, output: 0.9, gradient: 0.12 },
      { id: 'B', weights: [0.482, 0.082, 0.182], bias: 0.282, output: 1.1, gradient: 0.18 },
    ],
    explanation: '第四步：权重更新——独立演化\n权重更新后保持不同：w_A ≠ w_B\n网络可以学习丰富的表示',
  });

  // Step 4: Success
  states.push({
    step: 4,
    neurons: [
      { id: 'A', weights: [0.188, 0.288, 0.388], bias: 0.088, output: 0.9, gradient: 0.12 },
      { id: 'B', weights: [0.482, 0.082, 0.182], bias: 0.282, output: 1.1, gradient: 0.18 },
    ],
    explanation: '解决方案：非对称初始化\n✓ 神经元产生不同的输出\n✓ 梯度不同，独立更新\n✓ 网络充分利用容量\n✓ 训练能够收敛',
  });

  return states;
};

export default function Home() {
  const [mode, setMode] = useState<InitializationMode>('symmetric');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const states = useMemo(() => {
    if (mode === 'symmetric') return generateNetworkStates();
    return generateAsymmetricStates();
  }, [mode]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, states.length - 1));
    setIsPlaying(false);
  }, [states.length]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  }, []);

  const handleModeChange = useCallback((newMode: InitializationMode) => {
    setMode(newMode);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Animation loop
  React.useEffect(() => {
    if (!isPlaying || states.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= states.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, states.length]);

  const currentState = states[currentStep] || states[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-slate-900">
            神经网络初始化对称性问题
          </h1>
          <p className="text-slate-600 mt-3 text-lg">
            通过交互式动画理解为什么相同的权重初始化会导致训练失败
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Network Visualization (60%) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">
                  网络结构可视化
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  观察不同初始化方案下神经元的权重和输出变化
                </p>
              </div>
              <div className="p-6" style={{ minHeight: '500px' }}>
                <NetworkVisualization
                  neurons={currentState.neurons}
                  mode={mode}
                />
              </div>
            </div>

            {/* Animation Controls */}
            <AnimationControls
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={states.length}
              speed={speed}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleReset}
              onSpeedChange={handleSpeedChange}
              onStepChange={handleStepChange}
            />
          </div>

          {/* Right Panel: Theory & Comparison (40%) */}
          <div className="lg:col-span-1 space-y-4">
            <Tabs value={mode} onValueChange={(v) => handleModeChange(v as InitializationMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger value="symmetric" className="text-xs sm:text-sm">
                  对称初始化
                </TabsTrigger>
                <TabsTrigger value="asymmetric" className="text-xs sm:text-sm">
                  非对称初始化
                </TabsTrigger>
              </TabsList>

              <TabsContent value="symmetric" className="space-y-4 mt-4">
                <TheoryPanel
                  state={currentState}
                  mode="symmetric"
                />
              </TabsContent>

              <TabsContent value="asymmetric" className="space-y-4 mt-4">
                <TheoryPanel
                  state={currentState}
                  mode="asymmetric"
                />
              </TabsContent>
            </Tabs>

            {/* Comparison Panel */}
            <ComparisonPanel currentStep={currentStep} />
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              🎯 问题分析
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>对称性陷阱：</strong>当所有神经元使用相同的权重初始化时，它们在训练过程中会始终保持对称性。
              </p>
              <p>
                <strong>数学原因：</strong>相同的输入、相同的权重导致相同的输出，进而产生相同的梯度，权重更新也相同。
              </p>
              <p>
                <strong>后果：</strong>网络无法学习多样化的特征表示，模型容量被浪费，训练无法有效进行。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              ✨ 解决方案
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <strong>随机初始化：</strong>使用小的随机值初始化权重，打破对称性。
              </p>
              <p>
                <strong>标准方法：</strong>Xavier 初始化、He 初始化等方法根据网络层的大小调整初始值范围。
              </p>
              <p>
                <strong>效果：</strong>神经元学习不同的特征，网络充分利用容量，训练有效收敛。
              </p>
            </div>
          </div>
        </div>

        {/* Mathematical Explanation */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            📐 数学推导
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">前向传播</h4>
              <div className="bg-slate-50 p-3 rounded text-sm font-mono text-slate-700 space-y-1">
                <p>z_A = w_A · x + b_A</p>
                <p>z_B = w_B · x + b_B</p>
                <p className="text-red-600">若 w_A = w_B, b_A = b_B</p>
                <p className="text-red-600">则 z_A = z_B</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">反向传播</h4>
              <div className="bg-slate-50 p-3 rounded text-sm font-mono text-slate-700 space-y-1">
                <p>∂L/∂w_A = ∂L/∂z_A · ∂z_A/∂w_A</p>
                <p>∂L/∂w_B = ∂L/∂z_B · ∂z_B/∂w_B</p>
                <p className="text-red-600">若 z_A = z_B</p>
                <p className="text-red-600">则 ∂L/∂w_A = ∂L/∂w_B</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">权重更新</h4>
              <div className="bg-slate-50 p-3 rounded text-sm font-mono text-slate-700 space-y-1">
                <p>w_A ← w_A - α·∂L/∂w_A</p>
                <p>w_B ← w_B - α·∂L/∂w_B</p>
                <p className="text-red-600">若 ∂L/∂w_A = ∂L/∂w_B</p>
                <p className="text-red-600">则 w_A 始终 = w_B</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
