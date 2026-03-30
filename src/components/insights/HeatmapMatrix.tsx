import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type HeatmapCell = {
  row: string;
  column: string;
  value: number;
  label?: string;
  meta?: string;
  accentColor?: string;
};

interface HeatmapMatrixProps {
  title: string;
  description?: string;
  rows: string[];
  columns: string[];
  cells: HeatmapCell[];
  formatValue?: (value: number) => string;
  emptyLabel?: string;
  className?: string;
}

function getCellStyle(value: number, maxValue: number, accentColor?: string) {
  if (value <= 0 || maxValue <= 0) {
    return {
      backgroundColor: 'hsl(var(--muted))',
      color: 'hsl(var(--muted-foreground))',
      borderColor: 'hsl(var(--border))',
    };
  }

  const opacity = Math.max(0.18, Math.min(0.92, value / maxValue));
  const rgb = accentColor ?? '59, 130, 246';

  return {
    backgroundColor: `rgba(${rgb}, ${opacity})`,
    color: opacity > 0.5 ? '#ffffff' : 'hsl(var(--foreground))',
    borderColor: `rgba(${rgb}, ${Math.min(1, opacity + 0.15)})`,
  };
}

export function HeatmapMatrix({
  title,
  description,
  rows,
  columns,
  cells,
  formatValue = (value) => value.toLocaleString(),
  emptyLabel = '--',
  className,
}: HeatmapMatrixProps) {
  const cellMap = new Map(cells.map((cell) => [`${cell.row}::${cell.column}`, cell] as const));
  const maxValue = cells.reduce((max, cell) => Math.max(max, cell.value), 0);

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[560px] gap-2"
          style={{ gridTemplateColumns: `180px repeat(${columns.length}, minmax(92px, 1fr))` }}
        >
          <div />
          {columns.map((column) => (
            <div key={column} className="px-2 text-center text-xs font-medium text-muted-foreground">
              {column}
            </div>
          ))}

          {rows.map((row) => (
            <div key={row} className="contents">
              <div className="flex items-center pr-2 text-sm font-medium">{row}</div>
              {columns.map((column) => {
                const cell = cellMap.get(`${row}::${column}`);
                const value = cell?.value ?? 0;
                const displayValue = value > 0 ? formatValue(value) : emptyLabel;
                const style = getCellStyle(value, maxValue, cell?.accentColor);

                return (
                  <Tooltip key={`${row}-${column}`}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex h-16 items-center justify-center rounded-lg border text-center text-sm font-semibold transition-transform hover:scale-[1.02]"
                        style={style}
                      >
                        <span className="px-2">{displayValue}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-64">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {row} / {column}
                        </p>
                        <p>{cell?.label ?? displayValue}</p>
                        {cell?.meta ? <p className="text-[11px] opacity-80">{cell.meta}</p> : null}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
