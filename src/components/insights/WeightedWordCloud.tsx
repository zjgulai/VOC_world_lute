import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type WeightedWord = {
  text: string;
  weight: number;
  meta?: string;
  tone?: 'default' | 'strong' | 'muted';
};

interface WeightedWordCloudProps {
  title: string;
  description?: string;
  words: WeightedWord[];
  className?: string;
}

function getWordStyle(weight: number, maxWeight: number, tone: WeightedWord['tone']) {
  const ratio = maxWeight > 0 ? weight / maxWeight : 0;
  const fontSize = 13 + ratio * 19;

  if (tone === 'strong') {
    return {
      fontSize: `${fontSize}px`,
      backgroundColor: `rgba(239, 68, 68, ${0.12 + ratio * 0.3})`,
      color: '#b91c1c',
    };
  }

  if (tone === 'muted') {
    return {
      fontSize: `${fontSize - 1}px`,
      backgroundColor: `rgba(59, 130, 246, ${0.08 + ratio * 0.2})`,
      color: '#1d4ed8',
    };
  }

  return {
    fontSize: `${fontSize}px`,
    backgroundColor: `rgba(16, 185, 129, ${0.1 + ratio * 0.22})`,
    color: '#047857',
  };
}

export function WeightedWordCloud({
  title,
  description,
  words,
  className,
}: WeightedWordCloudProps) {
  const maxWeight = words.reduce((max, word) => Math.max(max, word.weight), 0);
  const topWords = words.slice(0, 6);
  const toneCounts = words.reduce(
    (acc, word) => {
      const tone = word.tone ?? 'default';
      acc[tone] += 1;
      return acc;
    },
    { strong: 0, default: 0, muted: 0 }
  );

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>

      <div className="flex min-h-48 flex-wrap items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 p-6">
        {words.length > 0 ? (
          words.map((word) => (
            <Tooltip key={word.text}>
              <TooltipTrigger asChild>
                <span
                  className="cursor-default rounded-full px-3 py-1 font-semibold tracking-tight transition-transform hover:scale-105"
                  style={getWordStyle(word.weight, maxWeight, word.tone)}
                >
                  {word.text}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64">
                <div className="space-y-1">
                  <p className="font-medium">{word.text}</p>
                  <p>权重 {word.weight.toFixed(1)}</p>
                  {word.meta ? <p className="text-[11px] opacity-80">{word.meta}</p> : null}
                </div>
              </TooltipContent>
            </Tooltip>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">当前筛选条件下暂无可生成词云的文本标签。</p>
        )}
      </div>

      {words.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-medium text-muted-foreground">高权重标签</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {topWords.map((word) => (
                <span
                  key={word.text}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">标签图例</p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>红色：核心主题</span>
                <span>{toneCounts.strong}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>绿色：痛点/决策</span>
                <span>{toneCounts.default}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>蓝色：场景/信任</span>
                <span>{toneCounts.muted}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
