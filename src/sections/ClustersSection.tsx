import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { HeatmapMatrix } from '@/components/insights/HeatmapMatrix';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Map,
  Users,
  Heart,
  Lightbulb,
  DollarSign,
  Share2,
  AlertCircle,
  Target,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  BarChart3,
} from 'lucide-react';
import { regionClusters, clusterColors } from '@/data/vocData';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ALL = '__ALL__';

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function ClustersSection() {
  const [expandedCluster, setExpandedCluster] = useState<string | null>(regionClusters[0]?.name ?? null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRepresentative, setSelectedRepresentative] = useState(ALL);
  const [sortMode, setSortMode] = useState<'count' | 'name'>('count');

  const representatives = useMemo(
    () => uniqueValues(regionClusters.flatMap((cluster) => cluster.top20Representatives)),
    []
  );

  const filteredClusters = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return regionClusters
      .filter((cluster) => {
        if (selectedRepresentative !== ALL && !cluster.top20Representatives.includes(selectedRepresentative)) {
          return false;
        }

        if (!keyword) return true;

        return [
          cluster.name,
          cluster.customerCharacteristics,
          cluster.trustSources,
          cluster.contentAngles,
          cluster.channelFocus,
          cluster.priorityActions,
          cluster.countryDifferences,
          cluster.top20Representatives.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      })
      .sort((a, b) => {
        if (sortMode === 'name') return a.name.localeCompare(b.name, 'zh-CN');
        return b.top20Count - a.top20Count || a.name.localeCompare(b.name, 'zh-CN');
      });
  }, [searchKeyword, selectedRepresentative, sortMode]);

  useEffect(() => {
    if (!filteredClusters.some((cluster) => cluster.name === expandedCluster)) {
      setExpandedCluster(filteredClusters[0]?.name ?? null);
    }
  }, [expandedCluster, filteredClusters]);

  const totalRepresentativeCount = uniqueValues(
    filteredClusters.flatMap((cluster) => cluster.top20Representatives)
  ).length;
  const maxCountryCluster = filteredClusters[0] ?? null;
  const clusterCoverageData = filteredClusters.map((cluster) => ({
    cluster: cluster.name,
    top20Count: cluster.top20Count,
    representativeCount: cluster.top20Representatives.length,
  }));
  const representativeStructure = useMemo(() => {
    const representatives = uniqueValues(filteredClusters.flatMap((cluster) => cluster.top20Representatives)).slice(0, 10);
    const cells = filteredClusters.flatMap((cluster) =>
      representatives.map((country) => {
        const included = cluster.top20Representatives.includes(country);
        return {
          row: cluster.name,
          column: country,
          value: included ? 1 : 0,
          label: included ? `${country} 是 ${cluster.name} 的代表国家` : `${country} 不在 ${cluster.name} 代表国家中`,
          meta: included ? `Cluster 覆盖 ${cluster.top20Count} 个 TOP20 国家` : '用于观察 Cluster 之间的代表国家结构差异',
          accentColor: clusterColors[cluster.name]
            ? clusterColors[cluster.name]
                .replace('#', '')
                .match(/.{1,2}/g)
                ?.map((value) => parseInt(value, 16))
                .join(', ')
            : '59, 130, 246',
        };
      })
    );

    return { representatives, cells };
  }, [filteredClusters]);
  const avgTop20Count =
    filteredClusters.length > 0
      ? filteredClusters.reduce((sum, cluster) => sum + cluster.top20Count, 0) / filteredClusters.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
          <Map className="h-5 w-5 text-cyan-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">区域策略</h2>
          <p className="text-sm text-muted-foreground">区域 Cluster 策略卡的筛选分析台与展开视图</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                <Map className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前 Cluster</p>
                <p className="text-xl font-bold">{filteredClusters.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">代表国家数</p>
                <p className="text-xl font-bold">{totalRepresentativeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Target className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">平均覆盖国家</p>
                <p className="text-xl font-bold">{avgTop20Count.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <CheckCircle2 className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">最大 Cluster</p>
                <p className="text-xl font-bold">{maxCountryCluster?.top20Count ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            区域策略筛选台
          </CardTitle>
          <p className="text-sm text-muted-foreground">支持关键词、代表国家与排序联动筛选 Cluster 策略卡</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="搜索 Cluster、客群特征、渠道策略或建议动作"
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedRepresentative} onValueChange={setSelectedRepresentative}>
              <SelectTrigger>
                <SelectValue placeholder="代表国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部代表国家</SelectItem>
                {representatives.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortMode} onValueChange={(value) => setSortMode(value as 'count' | 'name')}>
              <SelectTrigger>
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">按覆盖国家数</SelectItem>
                <SelectItem value="name">按 Cluster 名称</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredClusters.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Cluster 覆盖广度对比
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                对比各区域 Cluster 覆盖多少个 TOP20 国家，判断区域策略应走“广覆盖”还是“聚焦打法”。
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterCoverageData} layout="vertical" margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="cluster" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name === 'top20Count' ? 'TOP20覆盖国家数' : '代表国家数']}
                      labelFormatter={(label) => `${label} 覆盖结构`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="top20Count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="representativeCount" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <InsightCallout
            title="区域覆盖洞察"
            icon={<Map className="h-4 w-4 text-primary" />}
            summary={
              maxCountryCluster
                ? `${maxCountryCluster.name} 当前覆盖最多的 TOP20 国家，更适合作为区域策略模板和跨国家共性打法的优先沉淀对象。`
                : '当前筛选范围内暂无明确的区域覆盖优势。'
            }
            bullets={[
              '覆盖国家数高的 Cluster 更适合先抽象共性客群、内容和价格策略，再下钻国家差异点。',
              '覆盖国家数不高但策略字段非常完整的 Cluster，往往更适合做重点样板市场而不是泛化模板。',
              '代表国家重复度高时，说明几个 Cluster 之间可能存在策略边界重叠，适合进一步做细分对比。',
            ]}
            scopeNote="范围说明：该图基于 Cluster 策略卡中的代表国家与 TOP20 覆盖字段，适合做区域策略优先级判断。"
          />
        </div>
      )}

      {filteredClusters.length > 0 && representativeStructure.representatives.length > 0 && (
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Cluster × 代表国家结构矩阵</CardTitle>
            <p className="text-sm text-muted-foreground">
              查看不同 Cluster 共享了哪些代表国家，识别区域策略边界是否清晰。
            </p>
          </CardHeader>
          <CardContent>
            <HeatmapMatrix
              title="代表国家分布"
              description="数值 1 表示该国家被纳入对应 Cluster 的代表国家集合。"
              rows={filteredClusters.map((cluster) => cluster.name)}
              columns={representativeStructure.representatives}
              cells={representativeStructure.cells}
              emptyLabel="0"
            />
          </CardContent>
        </Card>
      )}

      {filteredClusters.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredClusters.map((cluster) => (
              <Card
                key={cluster.name}
                className={`cursor-pointer transition-all duration-200 ${
                  expandedCluster === cluster.name ? 'ring-2 ring-primary card-shadow-hover' : 'card-shadow hover:card-shadow-hover'
                }`}
                onClick={() => setExpandedCluster(expandedCluster === cluster.name ? null : cluster.name)}
              >
                <CardContent className="p-3">
                  <div
                    className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${clusterColors[cluster.name] || '#6b7280'}20` }}
                  >
                    <Map
                      className="h-4 w-4"
                      style={{ color: clusterColors[cluster.name] || '#6b7280' }}
                    />
                  </div>
                  <p className="truncate text-sm font-medium">{cluster.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {cluster.top20Count}国
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            {filteredClusters.map((cluster) => {
              const isExpanded = expandedCluster === cluster.name;

              return (
                <Card
                  key={cluster.name}
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'ring-2 ring-primary card-shadow-hover' : 'card-shadow'
                  }`}
                >
                  <CardHeader className="cursor-pointer pb-3" onClick={() => setExpandedCluster(isExpanded ? null : cluster.name)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${clusterColors[cluster.name] || '#6b7280'}20` }}
                        >
                          <Map
                            className="h-6 w-6"
                            style={{ color: clusterColors[cluster.name] || '#6b7280' }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{cluster.name}</CardTitle>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: `${clusterColors[cluster.name] || '#6b7280'}20`,
                                color: clusterColors[cluster.name] || '#6b7280',
                              }}
                            >
                              TOP20: {cluster.top20Count}个国家
                            </Badge>
                            {cluster.top20Representatives.map((country: string) => (
                              <span
                                key={country}
                                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {country}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        style={{ backgroundColor: `${clusterColors[cluster.name] || '#6b7280'}10` }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: clusterColors[cluster.name] || '#6b7280' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4 pt-0">
                      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                        <Users
                          className="mt-0.5 h-5 w-5 flex-shrink-0"
                          style={{ color: clusterColors[cluster.name] || '#6b7280' }}
                        />
                        <div>
                          <p className="text-sm font-medium">共性客群特征</p>
                          <p className="mt-1 text-sm text-muted-foreground">{cluster.customerCharacteristics}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-500" />
                          <div>
                            <p className="text-sm font-medium">共性信任来源</p>
                            <p className="mt-1 text-sm text-muted-foreground">{cluster.trustSources}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium">共性内容切口</p>
                            <p className="mt-1 text-sm text-muted-foreground">{cluster.contentAngles}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">共性价格策略</p>
                            <p className="mt-1 text-sm text-muted-foreground">{cluster.priceStrategy}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Share2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">渠道与平台侧重</p>
                            <p className="mt-1 text-sm text-muted-foreground">{cluster.channelFocus}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium">国家差异点</p>
                          <p className="mt-1 text-sm text-muted-foreground">{cluster.countryDifferences}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium">建议优先动作</p>
                          <p className="mt-1 text-sm text-muted-foreground">{cluster.priorityActions}</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card className="card-shadow">
          <CardContent className="p-6 text-sm text-muted-foreground">
            当前筛选条件下没有匹配的 Cluster 策略卡，请放宽关键词或代表国家条件。
          </CardContent>
        </Card>
      )}
    </div>
  );
}
