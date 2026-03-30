import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  Globe2, 
  Target, 
  Layers,
  TrendingUp,
  Info,
  Waypoints,
} from 'lucide-react';
import { projectOverview, top20Countries } from '@/data/vocData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stats = [
  {
    label: '原始数据行数',
    value: projectOverview.rawDataRows,
    icon: FileSpreadsheet,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: '有效分析行数',
    value: projectOverview.validAnalysisRows,
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'TOP20国家',
    value: projectOverview.top20CountriesCount,
    icon: Globe2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    label: 'TOP10国家',
    value: projectOverview.top10CountriesCount,
    icon: Target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    label: '目标组合数',
    value: projectOverview.top10TargetCombinations,
    icon: Layers,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    label: 'P1组合数',
    value: projectOverview.p1Combinations,
    icon: TrendingUp,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
];

const excludedProducts = projectOverview.excludedProductLines;

// Prepare chart data
const top5Countries = top20Countries.slice(0, 5).map(c => ({
  name: c.country,
  sales: Math.round(c.sales / 1000),
}));

const clusterData = Object.entries(
  top20Countries.reduce<Record<string, number>>((acc, item) => {
    acc[item.regionCluster] = (acc[item.regionCluster] || 0) + 1;
    return acc;
  }, {})
).map(([name, value], index) => ({
  name,
  value,
  color: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#ef4444', '#84cc16', '#14b8a6', '#6366f1', '#0ea5e9', '#22c55e', '#a855f7'][index % 14],
}));

export function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">项目总览</h2>
          <p className="text-sm text-muted-foreground">
            VOC目的国舆情分析项目核心指标概览
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-shadow hover:card-shadow-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Countries Bar Chart */}
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">TOP5国家销售额</CardTitle>
            <p className="text-sm text-muted-foreground">单位：千美元</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top5Countries} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `$${v}K`} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value}K`, '销售额']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Region Cluster Distribution */}
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">区域Cluster分布</CardTitle>
            <p className="text-sm text-muted-foreground">TOP20国家在各区域的分布</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clusterData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {clusterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}个国家`, name]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {clusterData.slice(0, 6).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Excluded Products */}
      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">排除品线</CardTitle>
          <p className="text-sm text-muted-foreground">本次分析中排除的产品线</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {excludedProducts.map((product) => (
              <span
                key={product}
                className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {product}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="card-shadow border-l-4 border-l-primary">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">核心洞察</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">数据覆盖广泛：</span>
                  原始数据覆盖{projectOverview.rawDataRows}个国家×品线组合，有效分析{projectOverview.validAnalysisRows}个
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">头部集中明显：</span>
                  美国销售额${(top20Countries[0].sales / 1000).toFixed(0)}K，占TOP20总额的{(top20Countries[0].sales / top20Countries.reduce((a, b) => a + b.sales, 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">区域分布多元：</span>
                  覆盖11个区域Cluster，东南亚移动社媒区国家数最多（4个）
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">重点组合聚焦：</span>
                  29个TOP10目标国家×品线组合，其中P1优先级组合{projectOverview.p1Combinations}个
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InsightCallout
          title="图表解读说明"
          icon={<Info className="h-4 w-4 text-primary" />}
          summary="当前看板中的新图表已统一成同一套解读方式：筛选器联动、悬浮 tooltip、空态提示和范围说明会在不同页面保持一致。"
          bullets={[
            '热力矩阵中颜色越深，代表该组合的强度越高；优先级高的格子会额外用更强的强调色表达。',
            '结构占比图用于判断资源分配和渠道侧重点，不直接等同于真实流量或市场份额。',
            '每个图表下方的“洞察”卡片都在回答一个业务问题，帮助从可视化直接进入决策讨论。',
          ]}
          scopeNote="统一规则：先用筛选器缩小问题范围，再看图，再读范围说明，最后再结合明细表或详情卡做验证。"
        />

        <InsightCallout
          title="二期可视化路线"
          icon={<Waypoints className="h-4 w-4 text-primary" />}
          badge="预研能力"
          summary="词云图和知识图谱适合作为第二阶段的叙事增强能力，但当前结构化数据更适合先做可解释的业务核心图。"
          bullets={[
            '词云图优先适配 P1 搜索主题和客群痛点词，用于辅助发现共性话题，而不是作为强统计结论。',
            '知识图谱优先适配 国家-Cluster-品线-客群-平台 的业务关系网络，用于探索策略边界和内容分发路径。',
            '如果后续引入原始 VOC 文本流，词云和图谱的分析价值会显著提升，届时再考虑引入专用可视化库。',
          ]}
          scopeNote="当前阶段的边界：现有数据以业务整理字段为主，适合先把结构化交叉洞察做深，再扩展到更探索型的关系图。"
        />
      </div>
    </div>
  );
}
