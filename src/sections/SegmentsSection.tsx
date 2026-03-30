import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { HeatmapMatrix } from '@/components/insights/HeatmapMatrix';
import { WeightedWordCloud } from '@/components/insights/WeightedWordCloud';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Target,
  Heart,
  AlertCircle,
  Lightbulb,
  DollarSign,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Globe2,
} from 'lucide-react';
import { customerSegments, clusterColors } from '@/data/vocData';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { extractInsightTerms, formatInsightSources } from '@/lib/insightText';

const ALL = '__ALL__';

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function priorityWeight(priority: string) {
  if (priority === 'P0') return 0;
  if (priority === 'P1') return 1;
  return 2;
}

const PRIORITY_COLUMNS = ['P0', 'P1', 'P2'] as const;
const SEGMENT_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
const TOP_ARCHETYPE_LIMIT = 6;

export function SegmentsSection() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(ALL);
  const [selectedCluster, setSelectedCluster] = useState(ALL);
  const [selectedProductLine, setSelectedProductLine] = useState(ALL);
  const [selectedPriority, setSelectedPriority] = useState(ALL);
  const [sortMode, setSortMode] = useState<'priority' | 'country' | 'segment'>('priority');

  const countries = useMemo(() => uniqueValues(customerSegments.map((segment) => segment.country)), []);
  const clusters = useMemo(() => uniqueValues(customerSegments.map((segment) => segment.regionCluster)), []);
  const productLines = useMemo(() => uniqueValues(customerSegments.map((segment) => segment.productLine)), []);

  const filteredSegments = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return customerSegments
      .filter((segment) => {
        if (selectedCountry !== ALL && segment.country !== selectedCountry) return false;
        if (selectedCluster !== ALL && segment.regionCluster !== selectedCluster) return false;
        if (selectedProductLine !== ALL && segment.productLine !== selectedProductLine) return false;
        if (selectedPriority !== ALL && segment.priority !== selectedPriority) return false;

        if (!keyword) return true;

        return [
          segment.country,
          segment.segmentCode,
          segment.segmentName,
          segment.productLine,
          segment.corePainPoints,
          segment.mainBarriers,
          segment.coreCompetitors,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      })
      .sort((a, b) => {
        if (sortMode === 'country') {
          return a.country.localeCompare(b.country, 'zh-CN') || a.segmentCode.localeCompare(b.segmentCode, 'zh-CN');
        }
        if (sortMode === 'segment') {
          return a.segmentCode.localeCompare(b.segmentCode, 'zh-CN') || a.country.localeCompare(b.country, 'zh-CN');
        }
        return (
          priorityWeight(a.priority) - priorityWeight(b.priority) ||
          a.country.localeCompare(b.country, 'zh-CN') ||
          a.segmentCode.localeCompare(b.segmentCode, 'zh-CN')
        );
      });
  }, [searchKeyword, selectedCountry, selectedCluster, selectedProductLine, selectedPriority, sortMode]);

  const segmentArchetypeSummary = useMemo(() => {
    const summaryMap = new Map<
      string,
      {
        segmentName: string;
        count: number;
        countries: Set<string>;
        lifecycles: Set<string>;
        priorities: string[];
      }
    >();

    filteredSegments.forEach((segment) => {
      const current =
        summaryMap.get(segment.segmentName) ??
        {
          segmentName: segment.segmentName,
          count: 0,
          countries: new Set<string>(),
          lifecycles: new Set<string>(),
          priorities: [],
        };

      current.count += 1;
      current.countries.add(segment.country);
      current.lifecycles.add(segment.lifecycle);
      current.priorities.push(segment.priority);
      summaryMap.set(segment.segmentName, current);
    });

    return [...summaryMap.values()]
      .sort((a, b) => b.count - a.count || a.segmentName.localeCompare(b.segmentName, 'zh-CN'))
      .map((item) => ({
        ...item,
        countryCount: item.countries.size,
        lifecycleSummary: [...item.lifecycles].sort((a, b) => a.localeCompare(b, 'zh-CN')).join(' / '),
        topPriority: item.priorities.sort((a, b) => priorityWeight(a) - priorityWeight(b))[0] ?? 'P2',
      }));
  }, [filteredSegments]);

  const visibleCountryCount = uniqueValues(filteredSegments.map((segment) => segment.country)).length;
  const visibleClusterCount = uniqueValues(filteredSegments.map((segment) => segment.regionCluster)).length;
  const p0SegmentCount = filteredSegments.filter((segment) => segment.priority === 'P0').length;
  const clusterPriorityMatrix = useMemo(() => {
    const rows = uniqueValues(filteredSegments.map((segment) => segment.regionCluster));
    const cells = rows.flatMap((row) =>
      PRIORITY_COLUMNS.map((column) => {
        const matches = filteredSegments.filter(
          (segment) => segment.regionCluster === row && segment.priority === column
        );

        return {
          row,
          column,
          value: matches.length,
          label: `${row} 中 ${column} 客群记录 ${matches.length} 条`,
          meta:
            matches.length > 0
              ? `代表客群：${uniqueValues(matches.map((item) => item.segmentName)).slice(0, 3).join(' / ')}`
              : '当前筛选下暂无此优先级客群',
          accentColor: column === 'P0' ? '239, 68, 68' : column === 'P1' ? '245, 158, 11' : '59, 130, 246',
        };
      })
    );

    return { rows, cells };
  }, [filteredSegments]);
  const lifecycleChartData = useMemo(() => {
    const lifecycleRows = uniqueValues(filteredSegments.map((segment) => segment.lifecycle));
    const archetypeNames = segmentArchetypeSummary
      .slice(0, TOP_ARCHETYPE_LIMIT)
      .map((item) => item.segmentName);

    return lifecycleRows.map((lifecycle) => {
      const row: Record<string, string | number> = { lifecycle };
      archetypeNames.forEach((segmentName) => {
        row[segmentName] = filteredSegments.filter(
          (segment) => segment.lifecycle === lifecycle && segment.segmentName === segmentName
        ).length;
      });
      return row;
    });
  }, [filteredSegments, segmentArchetypeSummary]);
  const strongestCluster = useMemo(() => {
    const clusterRows = uniqueValues(filteredSegments.map((segment) => segment.regionCluster)).map((cluster) => ({
      cluster,
      count: filteredSegments.filter((segment) => segment.regionCluster === cluster && segment.priority === 'P0').length,
    }));
    return clusterRows.sort((a, b) => b.count - a.count)[0] ?? null;
  }, [filteredSegments]);
  const personaWordCloud = useMemo(() => {
    const weights = new Map<string, { weight: number; meta: string[]; tone: 'default' | 'strong' | 'muted' }>();

    filteredSegments.forEach((segment) => {
      const weightedTerms = [
        ...extractInsightTerms(segment.corePainPoints).map((term) => ({ term, weight: 2.4, tone: 'strong' as const })),
        ...extractInsightTerms(segment.mainBarriers).map((term) => ({ term, weight: 1.8, tone: 'default' as const })),
        ...extractInsightTerms(segment.priorityContentAngles).map((term) => ({ term, weight: 1.6, tone: 'default' as const })),
        ...extractInsightTerms(segment.coreTrustSources).map((term) => ({ term, weight: 1.4, tone: 'muted' as const })),
      ];

      weightedTerms.forEach(({ term, weight, tone }) => {
        const current = weights.get(term) ?? { weight: 0, meta: [], tone };
        current.weight += weight;
        current.meta.push(`${segment.country} · ${segment.segmentName}`);
        if (tone === 'strong') current.tone = 'strong';
        weights.set(term, current);
      });
    });

    return [...weights.entries()]
      .map(([text, value]) => ({
        text,
        weight: Number(value.weight.toFixed(1)),
        meta: formatInsightSources(value.meta),
        tone: value.tone,
      }))
      .sort((a, b) => b.weight - a.weight || a.text.localeCompare(b.text, 'zh-CN'))
      .slice(0, 30);
  }, [filteredSegments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
          <Users className="h-5 w-5 text-rose-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">客群矩阵</h2>
          <p className="text-sm text-muted-foreground">国家 × 品线 × 客群三维矩阵的筛选分析台</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                <Users className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前客群记录</p>
                <p className="text-xl font-bold">{filteredSegments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Globe2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前国家数</p>
                <p className="text-xl font-bold">{visibleCountryCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Target className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前 Cluster 数</p>
                <p className="text-xl font-bold">{visibleClusterCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">P0 客群记录</p>
                <p className="text-xl font-bold">{p0SegmentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            客群分析筛选台
          </CardTitle>
          <p className="text-sm text-muted-foreground">支持关键词、国家、Cluster、品线、优先级和排序联动</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="搜索国家、客群、品线、痛点或竞品"
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部国家</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCluster} onValueChange={setSelectedCluster}>
              <SelectTrigger>
                <SelectValue placeholder="Cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部 Cluster</SelectItem>
                {clusters.map((cluster) => (
                  <SelectItem key={cluster} value={cluster}>
                    {cluster}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedProductLine} onValueChange={setSelectedProductLine}>
              <SelectTrigger>
                <SelectValue placeholder="品线" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部品线</SelectItem>
                {productLines.map((productLine) => (
                  <SelectItem key={productLine} value={productLine}>
                    {productLine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部优先级</SelectItem>
                <SelectItem value="P0">P0</SelectItem>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortMode} onValueChange={(value) => setSortMode(value as 'priority' | 'country' | 'segment')}>
              <SelectTrigger>
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">按优先级</SelectItem>
                <SelectItem value="country">按国家</SelectItem>
                <SelectItem value="segment">按客群编码</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {segmentArchetypeSummary.slice(0, 6).map((segmentType) => (
          <Card key={segmentType.segmentName} className="card-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                  <Users className="h-5 w-5 text-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{segmentType.segmentName}</p>
                  <p className="text-xs text-muted-foreground">{segmentType.lifecycleSummary}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {segmentType.count}条记录
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {segmentType.countryCount}个国家
                    </Badge>
                    <Badge variant={segmentType.topPriority === 'P0' ? 'default' : 'secondary'} className="text-xs">
                      {segmentType.topPriority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSegments.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Cluster × 优先级矩阵</CardTitle>
              <p className="text-sm text-muted-foreground">
                识别高优客群集中在哪些区域，辅助区域打法和素材资源分层。
              </p>
            </CardHeader>
            <CardContent>
              <HeatmapMatrix
                title="区域高优客群分布"
                description="优先看 P0 列中的深色格子，代表该区域高优客群沉淀更密集。"
                rows={clusterPriorityMatrix.rows}
                columns={[...PRIORITY_COLUMNS]}
                cells={clusterPriorityMatrix.cells}
                emptyLabel="0"
              />
            </CardContent>
          </Card>

          <InsightCallout
            title="客群矩阵洞察"
            icon={<Target className="h-4 w-4 text-primary" />}
            summary={
              strongestCluster && strongestCluster.count > 0
                ? `${strongestCluster.cluster} 当前拥有最多的 P0 客群记录，说明该区域更值得优先做细分客群打法与本地化内容匹配。`
                : '当前筛选范围内暂无明显的 P0 高优区域聚集。'
            }
            bullets={[
              '如果某个 Cluster 在 P0 和 P1 同时高密度出现，说明该区域适合建立分层客群运营包，而不是单一素材打法。',
              '若同一客群类型跨多个生命周期重复出现，可进一步提炼为跨区域可复制的人群画像模板。',
              'P2 高密度但 P0 稀疏的区域，更适合先做样本验证，而不是大规模资源投入。',
            ]}
            scopeNote="范围说明：矩阵基于当前筛选后的客群记录，反映的是结构密度与业务优先级，不代表真实用户规模。"
          />
        </div>
      )}

      {lifecycleChartData.length > 0 && segmentArchetypeSummary.length > 0 && (
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">生命周期 × 客群类型分布</CardTitle>
            <p className="text-sm text-muted-foreground">
              查看不同生命周期阶段下，哪些客群原型更常出现，避免把国家级编码误当成客群类型。
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifecycleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lifecycle" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number, name: string) => [value, `${name} 客群记录数`]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {segmentArchetypeSummary.slice(0, TOP_ARCHETYPE_LIMIT).map((segmentType, index) => (
                    <Bar
                      key={segmentType.segmentName}
                      dataKey={segmentType.segmentName}
                      stackId="lifecycle"
                      fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                      name={segmentType.segmentName}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">客群画像词云</CardTitle>
          <p className="text-sm text-muted-foreground">
            对当前筛选范围内的痛点、阻力、内容切口与信任来源做加权聚合，辅助识别高频画像标签。
          </p>
        </CardHeader>
        <CardContent>
          <WeightedWordCloud
            title="客群高频标签"
            description="红色更偏核心痛点，绿色偏阻力/内容切口，蓝色偏信任来源。越大代表在当前筛选范围中出现越频繁、权重越高。"
            words={personaWordCloud}
          />
        </CardContent>
      </Card>

      {filteredSegments.length > 0 ? (
        <div className="space-y-4">
          {filteredSegments.map((segment) => (
            <Card key={`${segment.country}-${segment.segmentCode}-${segment.productLine}`} className="card-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${clusterColors[segment.regionCluster] || '#6b7280'}20` }}
                    >
                      <Users
                        className="h-5 w-5"
                        style={{ color: clusterColors[segment.regionCluster] || '#6b7280' }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{segment.segmentName}</CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {segment.country}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `${clusterColors[segment.regionCluster] || '#6b7280'}20`,
                            color: clusterColors[segment.regionCluster] || '#6b7280',
                          }}
                        >
                          {segment.regionCluster}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {segment.productLine}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {segment.lifecycle}
                        </Badge>
                        <Badge variant={segment.priority === 'P0' ? 'default' : 'secondary'} className="text-xs">
                          {segment.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">购买力</p>
                    <p className="font-medium">{segment.purchasingPower}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">核心痛点</p>
                      <p className="text-sm text-muted-foreground">{segment.corePainPoints}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">主要阻力</p>
                      <p className="text-sm text-muted-foreground">{segment.mainBarriers}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-border pt-3 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Heart className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-500" />
                    <div>
                      <p className="text-sm font-medium">核心信任来源</p>
                      <p className="text-sm text-muted-foreground">{segment.coreTrustSources}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">优先内容切口</p>
                      <p className="text-sm text-muted-foreground">{segment.priorityContentAngles}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-border pt-3 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">价格敏感初判</p>
                      <p className="text-sm text-muted-foreground">{segment.priceSensitivity}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">本地化营销切口</p>
                      <p className="text-sm text-muted-foreground">{segment.localMarketingAngles}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-sm font-medium">核心平台</p>
                  <div className="flex flex-wrap gap-2">
                    {segment.socialPlatforms.length > 0 ? (
                      segment.socialPlatforms.map((platform: string) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">暂无</span>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-sm font-medium">核心竞争品牌</p>
                  <p className="text-sm text-muted-foreground">{segment.coreCompetitors || '暂无'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-shadow">
          <CardContent className="p-6 text-sm text-muted-foreground">
            当前筛选条件下没有匹配的客群记录，请放宽关键词或筛选条件。
          </CardContent>
        </Card>
      )}
    </div>
  );
}
