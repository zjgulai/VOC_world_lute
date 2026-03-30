import { useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type GraphNode = {
  id: string;
  label: string;
  group: 'core' | 'cluster' | 'product' | 'segment' | 'platform';
  meta?: string;
};

type GraphEdge = {
  source: string;
  target: string;
};

interface KnowledgeGraphProps {
  title: string;
  description?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  className?: string;
}

const GROUP_COLOR: Record<GraphNode['group'], string> = {
  core: '#111827',
  cluster: '#06b6d4',
  product: '#8b5cf6',
  segment: '#ef4444',
  platform: '#10b981',
};

export function KnowledgeGraph({
  title,
  description,
  nodes,
  edges,
  className,
}: KnowledgeGraphProps) {
  const width = 760;
  const height = 420;
  const centerX = width / 2;
  const centerY = height / 2;
  const core = nodes.find((node) => node.group === 'core');
  const outerNodes = nodes.filter((node) => node.group !== 'core');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(core?.id ?? null);
  const positionedNodes = new Map<
    string,
    GraphNode & {
      x: number;
      y: number;
      r: number;
    }
  >();

  if (core) {
    positionedNodes.set(core.id, { ...core, x: centerX, y: centerY, r: 34 });
  }

  outerNodes.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(outerNodes.length, 1) - Math.PI / 2;
    const band = node.group === 'cluster' ? 110 : node.group === 'product' ? 155 : 205;
    const x = centerX + Math.cos(angle) * band;
    const y = centerY + Math.sin(angle) * (band * 0.72);
    const r = node.group === 'cluster' ? 24 : node.group === 'product' ? 20 : 16;
    positionedNodes.set(node.id, { ...node, x, y, r });
  });

  const relatedNodeIds = useMemo(() => {
    if (!activeNodeId) {
      return new Set<string>(nodes.map((node) => node.id));
    }

    const ids = new Set<string>([activeNodeId]);
    edges.forEach((edge) => {
      if (edge.source === activeNodeId) ids.add(edge.target);
      if (edge.target === activeNodeId) ids.add(edge.source);
    });
    return ids;
  }, [activeNodeId, edges, nodes]);

  const activeNode = nodes.find((node) => node.id === activeNodeId) ?? core ?? nodes[0] ?? null;
  const activeRelations = activeNode
    ? edges
        .filter((edge) => edge.source === activeNode.id || edge.target === activeNode.id)
        .map((edge) => {
          const otherId = edge.source === activeNode.id ? edge.target : edge.source;
          return nodes.find((node) => node.id === otherId);
        })
        .filter(Boolean)
    : [];

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4 xl:grid-cols-[minmax(0,2fr)_280px]">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[420px] w-full min-w-[720px]">
            {edges.map((edge) => {
              const source = positionedNodes.get(edge.source);
              const target = positionedNodes.get(edge.target);
              if (!source || !target) return null;

              const isActive =
                !activeNodeId ||
                edge.source === activeNodeId ||
                edge.target === activeNodeId;

              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isActive ? 'hsl(var(--foreground))' : 'hsl(var(--border))'}
                  strokeWidth={isActive ? 2.2 : 1.2}
                  opacity={isActive ? 0.85 : 0.28}
                />
              );
            })}

            {[...positionedNodes.values()].map((node) => {
              const isActive = activeNodeId === node.id;
              const isRelated = relatedNodeIds.has(node.id);

              return (
                <Tooltip key={node.id}>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveNodeId(node.id)}
                      onClick={() => setActiveNodeId(node.id)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isActive ? node.r + 4 : node.r}
                        fill={GROUP_COLOR[node.group]}
                        opacity={isRelated ? (node.group === 'core' ? 0.96 : 0.9) : 0.24}
                        stroke={isActive ? '#f59e0b' : 'transparent'}
                        strokeWidth={3}
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fontSize={node.group === 'core' ? 12 : 10}
                        fill="#ffffff"
                        fontWeight="600"
                        opacity={isRelated ? 1 : 0.5}
                      >
                        {node.label.length > 8 ? `${node.label.slice(0, 8)}…` : node.label}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-64">
                    <div className="space-y-1">
                      <p className="font-medium">{node.label}</p>
                      <p className="text-[11px] opacity-80">{node.group}</p>
                      {node.meta ? <p className="text-[11px] opacity-80">{node.meta}</p> : null}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </svg>
        </div>

        <div className="rounded-xl border border-border bg-background p-3 text-sm">
          <p className="font-medium">关系说明</p>
          {activeNode ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">当前节点</p>
                <p className="mt-1 font-semibold">{activeNode.label}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{activeNode.group}</p>
              </div>
              {activeNode.meta ? (
                <div>
                  <p className="text-xs text-muted-foreground">说明</p>
                  <p className="mt-1 text-sm text-muted-foreground">{activeNode.meta}</p>
                </div>
              ) : null}
              <div>
                <p className="text-xs text-muted-foreground">直连关系</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeRelations.length > 0 ? (
                    activeRelations.map((node) => (
                      <span
                        key={node!.id}
                        className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {node!.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">当前节点暂无直连关系</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="text-xs text-primary underline-offset-4 hover:underline"
                onClick={() => setActiveNodeId(core?.id ?? null)}
              >
                回到国家主节点
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">当前暂无可分析的节点关系。</p>
          )}
        </div>
      </div>
    </div>
  );
}
