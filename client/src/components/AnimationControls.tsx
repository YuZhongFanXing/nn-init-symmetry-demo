import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimationControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStepChange: (step: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlayPause,
  onNext,
  onPrevious,
  onReset,
  onSpeedChange,
  onStepChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-4 bg-white border-slate-200 shadow-sm">
        {/* Playback Controls */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </Button>

          <Button
            onClick={onPrevious}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <SkipBack className="w-4 h-4" />
            上一步
          </Button>

          <Button
            onClick={onPlayPause}
            variant="default"
            size="sm"
            className="gap-2 flex-1"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                暂停
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                播放
              </>
            )}
          </Button>

          <Button
            onClick={onNext}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <SkipForward className="w-4 h-4" />
            下一步
          </Button>
        </div>

        {/* Timeline Scrubber */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-slate-600">
              步骤 {currentStep + 1} / {totalSteps}
            </span>
            <div className="flex-1">
              <Slider
                value={[currentStep]}
                onValueChange={(value) => onStepChange(value[0])}
                max={totalSteps - 1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
          <Zap className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-semibold text-slate-600">速度:</span>
          <div className="flex gap-2">
            {[0.5, 1, 1.5, 2].map((s) => (
              <Button
                key={s}
                onClick={() => onSpeedChange(s)}
                variant={speed === s ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnimationControls;
