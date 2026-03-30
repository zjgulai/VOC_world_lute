import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { HeatmapMatrix } from '@/components/insights/HeatmapMatrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Package, TrendingUp, BarChart3, Search, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import {
  productLines,
  productLineColors,
  productLineSalesByCountry,
  topCountryProductLines,
  countryProductProfiles,
  customerSegments,
} from '@/data/vocData';
import type { ProductLine, TopCountryProductLine } from '@/types';
import { useEffect, useMemo, useState } from 'react';
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
  Cell,
  Legend
} from 'recharts';

const ALL = '__ALL__';

const EMPTY_TOTALS: Record<ProductLine, number> = {
  '护理电器': 0,
  '家居出行': 0,
  '母婴综合护理': 0,
  '内衣服饰': 0,
  '喂养电器': 0,
  '吸奶器': 0,
  '智能母婴电器': 0,
};

type ProductInsight = {
  totalSales: number;
  marketRows: TopCountryProductLine[];
  topMarket: TopCountryProductLine | null;
  totalShare: number;
  priorityMarkets: string[];
  competitors: string[];
  platforms: string[];
  profiles: typeof countryProductProfiles;
  segments: typeof customerSegments;
};

function splitKeywords(value: string) {
  return value
    .split(/[、,，/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function topLabels(values: string[], limit = 6) {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
    .slice(0, limit)
    .map(([label]) => label);
}

function priorityAccent(priority: TopCountryProductLine['priority']) {
  if (priority === 'P0') return '239, 68, 68';
  if (priority === 'P1') return '245, 158, 11';
  return '59, 130, 246';
}

const productLineTotals = topCountryProductLines.reduce<Record<ProductLine, number>>(
  (acc: Record<ProductLine, number>, row: TopCountryProductLine) => {
    acc[row.productLine] += row.sales;
    return acc;
  },
  { ...EMPTY_TOTALS }
);

const pieData = (Object.entries(productLineTotals) as [ProductLine, number][])
  .filter((entry) => entry[1] > 0)
  .map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: productLineColors[name],
  }))
  .sort((a, b) => b.value - a.value);

const productInsights = productLines.reduce<Record<ProductLine, ProductInsight>>((acc, productLine) => {
  const marketRows = topCountryProductLines
    .filter((row: TopCountryProductLine) => row.productLine === productLine)
    .sort((a: TopCountryProductLine, b: TopCountryProductLine) => b.sales - a.sales);
  const profiles = countryProductProfiles.filter((profile) => profile.productLine === productLine);
  const segments = customerSegments.filter((segment) => segment.productLine === productLine);
  const totalSales = productLineTotals[productLine];
  const totalShare =
    marketRows.length > 0
      ? marketRows.reduce((sum: number, row: TopCountryProductLine) => sum + row.countryShare, 0) / marketRows.length
      : 0;
  const topMarket = marketRows[0] ?? null;
  const priorityMarkets = topLabels(
    marketRows
      .filter((row: TopCountryProductLine) => row.priority === 'P0')
      .map((row: TopCountryProductLine) => row.country),
    4
  );
  const competitors = topLabels(segments.flatMap((segment) => splitKeywords(segment.coreCompetitors)), 6);
  const platforms = topLabels(
    profiles.flatMap((profile) => [
      ...profile.socialPlatforms,
      ...profile.communityPlatforms,
      ...profile.officialPlatforms,
    ]),
    8
  );
  const profileCards = profiles
    .slice()
    .sort((a, b) => {
      const salesA = marketRows.find((row: TopCountryProductLine) => row.country === a.country)?.sales ?? 0;
      const salesB = marketRows.find((row: TopCountryProductLine) => row.country === b.country)?.sales ?? 0;
      return salesB - salesA;
    })
    .slice(0, 3);

  acc[productLine] = {
    totalSales,
    marketRows,
    topMarket,
    totalShare,
    priorityMarkets,
    competitors,
    platforms,
    profiles: profileCards,
    segments,
  };
  return acc;
}, {} as Record<ProductLine, ProductInsight>);

export function ProductsSection() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(ALL);
  const [sortMode, setSortMode] = useState<'sales' | 'coverage' | 'name'>('sales');
  const [activeTab, setActiveTab] = useState<ProductLine>('吸奶器');
  const countryCount = Object.keys(productLineSalesByCountry).length;
  const filteredProductLines = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return productLines
      .filter((productLine) => {
        const insight = productInsights[productLine];

        if (selectedPriority !== ALL) {
          const hasPriority = insight.marketRows.some((row) => row.priority === selectedPriority);
          if (!hasPriority) return false;
        }

        if (!keyword) return true;

        return (
          productLine.toLowerCase().includes(keyword) ||
          insight.competitors.some((item) => item.toLowerCase().includes(keyword)) ||
          insight.platforms.some((item) => item.toLowerCase().includes(keyword)) ||
          insight.marketRows.some((row) => row.country.toLowerCase().includes(keyword))
        );
      })
      .sort((a, b) => {
        if (sortMode === 'name') return a.localeCompare(b, 'zh-CN');
        if (sortMode === 'coverage') {
          return (
            productInsights[b].marketRows.length - productInsights[a].marketRows.length ||
            productInsights[b].totalSales - productInsights[a].totalSales
          );
        }

        return productInsights[b].totalSales - productInsights[a].totalSales;
      });
  }, [searchKeyword, selectedPriority, sortMode]);
  const filteredPieData = useMemo(
    () => pieData.filter((item) => filteredProductLines.includes(item.name as ProductLine)),
    [filteredProductLines]
  );
  const productHeatmapData = useMemo(() => {
    const activeRows = topCountryProductLines.filter((row) => {
      if (!filteredProductLines.includes(row.productLine)) return false;
      if (selectedPriority !== ALL && row.priority !== selectedPriority) return false;
      return true;
    });

    const countries = [...new Set(activeRows.map((row) => row.country))]
      .sort((a, b) => {
        const totalA = activeRows
          .filter((row) => row.country === a)
          .reduce((sum, row) => sum + row.sales, 0);
        const totalB = activeRows
          .filter((row) => row.country === b)
          .reduce((sum, row) => sum + row.sales, 0);
        return totalB - totalA;
      })
      .slice(0, 10);

    const cells = activeRows
      .filter((row) => countries.includes(row.country))
      .map((row) => ({
        row: row.country,
        column: row.productLine,
        value: row.sales,
        label: `${row.country} · ${row.productLine} 销售额 $${row.sales.toLocaleString()}`,
        meta: `国家内占比 ${(row.countryShare * 100).toFixed(1)}% · ${row.priority}`,
        accentColor: priorityAccent(row.priority),
      }));

    return { countries, cells };
  }, [filteredProductLines, selectedPriority]);
  const topMatrixOpportunity = useMemo(() => {
    const activeRows = topCountryProductLines
      .filter((row) => filteredProductLines.includes(row.productLine))
      .sort((a, b) => b.sales - a.sales);

    return activeRows[0] ?? null;
  }, [filteredProductLines]);

  useEffect(() => {
    if (!filteredProductLines.includes(activeTab)) {
      setActiveTab(filteredProductLines[0] ?? '吸奶器');
    }
  }, [activeTab, filteredProductLines]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">品线分析</h2>
          <p className="text-sm text-muted-foreground">
            基于 TOP10 国家品线、国家画像与客群矩阵的动态品线洞察
          </p>
        </div>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            品线分析筛选台
          </CardTitle>
          <p className="text-sm text-muted-foreground">支持关键词、优先级和排序切换，快速聚焦重点品线</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="搜索品线、国家、竞品或平台"
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="按优先级筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部优先级</SelectItem>
                <SelectItem value="P0">包含 P0 市场</SelectItem>
                <SelectItem value="P1">包含 P1 市场</SelectItem>
                <SelectItem value="P2">包含 P2 市场</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortMode} onValueChange={(value) => setSortMode(value as 'sales' | 'coverage' | 'name')}>
              <SelectTrigger>
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">按总销售额</SelectItem>
                <SelectItem value="coverage">按覆盖国家数</SelectItem>
                <SelectItem value="name">按名称</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Line Overview */}
      {filteredProductLines.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {filteredProductLines.map((pl) => {
            const sales = productInsights[pl].totalSales;
            const hasData = sales > 0;
            const activeMarkets = productInsights[pl].marketRows.length;
            
            return (
              <Card 
                key={pl} 
                className="card-shadow hover:card-shadow-hover transition-all cursor-pointer"
                onClick={() => setActiveTab(pl)}
              >
                <CardContent className="p-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${productLineColors[pl]}20` }}
                  >
                    <Package 
                      className="h-4 w-4" 
                      style={{ color: productLineColors[pl] }}
                    />
                  </div>
                  <p className="font-medium text-sm">{pl}</p>
                  {hasData ? (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${(sales / 1000).toFixed(0)}K
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {activeMarkets}个重点市场
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {productInsights[pl].priorityMarkets.slice(0, 2).map((country) => (
                          <Badge key={country} variant="secondary" className="text-[10px]">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">--</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="card-shadow">
          <CardContent className="p-6 text-sm text-muted-foreground">
            当前筛选条件下没有匹配的品线，请放宽关键词或优先级条件。
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">品线销售占比</CardTitle>
            <p className="text-sm text-muted-foreground">TOP{countryCount}国家各品线销售分布</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {filteredPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${(value / 1000).toFixed(0)}K`,
                      name
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value: string) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart by Country */}
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">各国品线销售对比</CardTitle>
            <p className="text-sm text-muted-foreground">TOP{countryCount}国家各品线销售额（千美元）</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(productLineSalesByCountry).map(([country, data]) => ({
                  country,
                  ...data,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  {filteredProductLines.slice(0, 5).map((pl) => (
                    <Bar 
                      key={pl}
                      dataKey={pl} 
                      stackId="a" 
                      fill={productLineColors[pl]}
                      radius={pl === '智能母婴电器' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {productHeatmapData.countries.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                国家 × 品线销售矩阵
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                用矩阵同时查看国家贡献、品线强弱和 P0/P1/P2 优先级层级
              </p>
            </CardHeader>
            <CardContent>
              <HeatmapMatrix
                title="重点市场组合热力"
                description="颜色越深代表组合销售额越高；红/橙/蓝分别对应 P0、P1、P2 优先级。"
                rows={productHeatmapData.countries}
                columns={filteredProductLines}
                cells={productHeatmapData.cells}
                formatValue={(value) => `$${(value / 1000).toFixed(0)}K`}
                emptyLabel="0"
              />
            </CardContent>
          </Card>

          <InsightCallout
            title="矩阵洞察"
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            summary={
              topMatrixOpportunity
                ? `当前销售额最高的国家 × 品线组合是 ${topMatrixOpportunity.country} × ${topMatrixOpportunity.productLine}，可作为国家市场与 SKU 资源配置的优先观察对象。`
                : '当前筛选条件下暂无可分析的国家 × 品线组合。'
            }
            bullets={[
              '优先看“高销售 + P0”的深色格子，这类组合最适合优先做 VOC 专项诊断与资源加码。',
              '如果同一国家在多条品线上都形成深色格子，说明该市场具备跨品线协同投放和平台复用的价值。',
              '如果某条品线只在极少数国家形成深色格子，说明更适合走聚焦策略，而非广撒网。',
            ]}
            scopeNote="范围说明：矩阵基于当前 TOP10 国家品线数据生成，用于相对优先级判断，不等同于全量市场份额。"
            badge={selectedPriority === ALL ? '全部优先级' : selectedPriority}
          />
        </div>
      )}

      {/* Product Line Details */}
      {filteredProductLines.length > 0 && (
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProductLine)} className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto">
          {filteredProductLines.map((pl) => (
            <TabsTrigger key={pl} value={pl} className="text-sm">
              {pl}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredProductLines.map((pl) => {
          const insight = productInsights[pl];
          const sales = insight.totalSales;
          
          return (
            <TabsContent key={pl} value={pl}>
              <Card className="card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${productLineColors[pl]}20` }}
                      >
                        <Package 
                          className="h-5 w-5" 
                          style={{ color: productLineColors[pl] }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pl}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {insight.topMarket
                            ? `重点市场集中在 ${insight.marketRows.length} 个国家，当前销售最高市场为 ${insight.topMarket.country}。`
                            : '当前品线暂无 TOP10 国家销售数据。'}
                        </p>
                      </div>
                    </div>
                    {sales > 0 && (
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: productLineColors[pl] }}>
                          ${(sales / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground">TOP{countryCount}国家总销售</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">覆盖国家</p>
                      <p className="mt-1 text-xl font-semibold">{insight.marketRows.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">平均国家占比</p>
                      <p className="mt-1 text-xl font-semibold">{(insight.totalShare * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">最高贡献市场</p>
                      <p className="mt-1 text-xl font-semibold">{insight.topMarket?.country ?? '--'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">P0 市场</p>
                      <p className="mt-1 text-xl font-semibold">{insight.priorityMarkets.length}</p>
                    </div>
                  </div>

                  {insight.priorityMarkets.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        P0优先市场
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.priorityMarkets.map((country) => (
                          <Badge key={country} className="bg-primary/10 text-primary hover:bg-primary/10">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {sales > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        各国销售分布
                      </h4>
                      <div className="space-y-2">
                        {insight.marketRows.map((row) => {
                            const percentage = sales > 0 ? (row.sales / sales) * 100 : 0;
                            
                            return (
                              <div key={row.country} className="flex items-center gap-3">
                                <span className="text-sm w-16">{row.country}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${percentage}%`,
                                      backgroundColor: productLineColors[pl]
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-20 text-right">
                                  ${(row.sales / 1000).toFixed(0)}K
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {insight.profiles.length > 0 && (
                    <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-3">
                      {insight.profiles.map((profile) => (
                        <Card key={`${profile.country}-${profile.productLine}`} className="border-none bg-muted/30 shadow-none">
                          <CardContent className="space-y-3 p-4">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{profile.country}</p>
                              <Badge variant="secondary">
                                {insight.marketRows.find((row) => row.country === profile.country)?.priority ?? 'P2'}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">身份画像</p>
                              <p className="mt-1 text-sm">{profile.persona || '暂无'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">购买习惯</p>
                              <p className="mt-1 text-sm">{profile.purchaseHabit || '暂无'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">营销偏好</p>
                              <p className="mt-1 text-sm">{profile.marketingPreference || '暂无'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">高频竞品</h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.competitors.length > 0 ? (
                          insight.competitors.map((competitor) => (
                            <Badge key={competitor} variant="secondary">
                              {competitor}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">暂无</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">高频平台</h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.platforms.length > 0 ? (
                          insight.platforms.map((platform) => (
                            <Badge key={platform} variant="secondary">
                              {platform}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">暂无</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      )}
    </div>
  );
}
