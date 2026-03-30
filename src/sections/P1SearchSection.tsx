import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeatmapMatrix } from '@/components/insights/HeatmapMatrix';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { WeightedWordCloud } from '@/components/insights/WeightedWordCloud';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Copy, Check, Target, Globe2, Grid3x3 } from 'lucide-react';
import { p1SearchItems } from '@/data/vocData';
import { extractInsightTerms, formatInsightSources } from '@/lib/insightText';

const ALL = '__ALL__';

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function P1SearchSection() {
  const [selectedCountry, setSelectedCountry] = useState(ALL);
  const [selectedProductLine, setSelectedProductLine] = useState(ALL);
  const [selectedPriority, setSelectedPriority] = useState(ALL);
  const [selectedTopic, setSelectedTopic] = useState(ALL);
  const [copiedKey, setCopiedKey] = useState('');

  const countries = useMemo(() => uniqueValues(p1SearchItems.map((item) => item.country)), []);
  const productLines = useMemo(() => uniqueValues(p1SearchItems.map((item) => item.productLine)), []);
  const priorities = useMemo(() => uniqueValues(p1SearchItems.map((item) => item.priority)), []);
  const topics = useMemo(() => uniqueValues(p1SearchItems.map((item) => item.topicClusters)), []);

  const filteredRows = useMemo(
    () =>
      p1SearchItems.filter((item) => {
        if (selectedCountry !== ALL && item.country !== selectedCountry) return false;
        if (selectedProductLine !== ALL && item.productLine !== selectedProductLine) return false;
        if (selectedPriority !== ALL && item.priority !== selectedPriority) return false;
        if (selectedTopic !== ALL && item.topicClusters !== selectedTopic) return false;
        return true;
      }),
    [selectedCountry, selectedProductLine, selectedPriority, selectedTopic]
  );
  const topicCountryMatrix = useMemo(() => {
    const countries = uniqueValues(filteredRows.map((item) => item.country)).slice(0, 10);
    const topicsByCount = [...new Map(
      filteredRows.map((item) => [item.topicClusters, filteredRows.filter((row) => row.topicClusters === item.topicClusters).length])
    ).entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
      .map(([topic]) => topic)
      .slice(0, 8);

    const cells = countries.flatMap((country) =>
      topicsByCount.map((topic) => {
        const matches = filteredRows.filter((item) => item.country === country && item.topicClusters === topic);
        const totalSales = matches.reduce((sum, item) => sum + item.sales, 0);
        const topPriority = matches.sort((a, b) => (a.priority < b.priority ? -1 : 1))[0]?.priority ?? 'P2';

        return {
          row: country,
          column: topic,
          value: matches.length,
          label: `${country} / ${topic} 共 ${matches.length} 条搜索组合`,
          meta: matches.length > 0 ? `销售额 $${totalSales.toLocaleString()} · 最高优先级 ${topPriority}` : '当前筛选下暂无该主题组合',
          accentColor: topPriority === 'P0' ? '239, 68, 68' : topPriority === 'P1' ? '245, 158, 11' : '59, 130, 246',
        };
      })
    );

    return { countries, topicsByCount, cells };
  }, [filteredRows]);
  const topTopicCountry = useMemo(() => {
    const pairs = new Map<string, { country: string; topic: string; count: number }>();
    filteredRows.forEach((row) => {
      const key = `${row.country}::${row.topicClusters}`;
      const current = pairs.get(key) ?? { country: row.country, topic: row.topicClusters, count: 0 };
      current.count += 1;
      pairs.set(key, current);
    });

    return [...pairs.values()].sort((a, b) => b.count - a.count)[0] ?? null;
  }, [filteredRows]);
  const keywordCloud = useMemo(() => {
    const weights = new Map<string, { weight: number; meta: string[]; tone: 'default' | 'strong' | 'muted' }>();

    filteredRows.forEach((row) => {
      const weightedTerms = [
        ...extractInsightTerms(row.topicClusters).map((term) => ({ term, weight: 3, tone: 'strong' as const })),
        ...extractInsightTerms(row.painPointTerms).map((term) => ({ term, weight: 2.2, tone: 'default' as const })),
        ...extractInsightTerms(row.scenarioTerms).map((term) => ({ term, weight: 1.6, tone: 'muted' as const })),
        ...extractInsightTerms(row.decisionTerms).map((term) => ({ term, weight: 1.8, tone: 'default' as const })),
        ...extractInsightTerms(row.coreProductTerms).map((term) => ({ term, weight: 1.2, tone: 'muted' as const })),
      ];

      weightedTerms.forEach(({ term, weight, tone }) => {
        const current = weights.get(term) ?? { weight: 0, meta: [], tone };
        current.weight += weight;
        current.meta.push(`${row.country} · ${row.productLine}`);
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
      .slice(0, 28);
  }, [filteredRows]);

  const copyText = async (key: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(''), 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Search className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">P1搜索清单</h2>
          <p className="text-sm text-muted-foreground">
            管理优先级最高的国家 × 品线搜索词、布尔组合与推荐入口
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">筛选后记录数</p>
                <p className="text-xl font-bold">{filteredRows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">覆盖国家数</p>
                <p className="text-xl font-bold">{uniqueValues(filteredRows.map((item) => item.country)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">唯一主题簇</p>
                <p className="text-xl font-bold">{uniqueValues(filteredRows.map((item) => item.topicClusters)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">筛选器</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full"><SelectValue placeholder="国家" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部国家</SelectItem>
                {countries.map((country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedProductLine} onValueChange={setSelectedProductLine}>
              <SelectTrigger className="w-full"><SelectValue placeholder="产品品线" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部品线</SelectItem>
                {productLines.map((line) => <SelectItem key={line} value={line}>{line}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full"><SelectValue placeholder="抓取优先级" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部优先级</SelectItem>
                {priorities.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full"><SelectValue placeholder="主题簇" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部主题簇</SelectItem>
                {topics.map((topic) => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {topicCountryMatrix.countries.length > 0 && topicCountryMatrix.topicsByCount.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                主题簇 × 国家热力矩阵
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                看高优国家在搜索主题上的重合度，判断关键词资产应走全球模板还是本地化分发。
              </p>
            </CardHeader>
            <CardContent>
              <HeatmapMatrix
                title="搜索主题覆盖热力"
                description="格子数值表示该国家在该主题簇下的搜索组合条数，颜色优先显示高优先级组合。"
                rows={topicCountryMatrix.countries}
                columns={topicCountryMatrix.topicsByCount}
                cells={topicCountryMatrix.cells}
                emptyLabel="0"
              />
            </CardContent>
          </Card>

          <InsightCallout
            title="搜索主题洞察"
            icon={<Search className="h-4 w-4 text-primary" />}
            summary={
              topTopicCountry
                ? `${topTopicCountry.country} 在 “${topTopicCountry.topic}” 主题下聚合了最多的高优搜索组合，说明这是优先沉淀搜索模板和内容资产的主题方向。`
                : '当前筛选范围内暂无清晰的主题簇聚集。'
            }
            bullets={[
              '同一个主题簇如果在多个国家同时高密度出现，适合抽象成通用搜索模板与标准化采样 SOP。',
              '只在单一国家显著集中的主题簇，更适合做本地语言变体和国家级专题分析。',
              '优先级越高的主题簇，越适合前置进关键词库与社区布尔检索模板。',
            ]}
            scopeNote="范围说明：热力矩阵按当前筛选后的 P1 搜索条目计数生成，适合做主题分发与搜索模板优先级判断。"
          />
        </div>
      )}

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">P1 搜索词云</CardTitle>
          <p className="text-sm text-muted-foreground">
            将主题簇、痛点词、场景词和决策词做加权聚合，辅助发现高优关键词资产。
          </p>
        </CardHeader>
        <CardContent>
          <WeightedWordCloud
            title="高频关键词云"
            description="红色更偏主题簇，绿色偏痛点/决策词，蓝色偏产品/场景词。字体越大，代表在当前筛选范围内权重越高。"
            words={keywordCloud}
          />
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">P1搜索明细</CardTitle>
          <p className="text-sm text-muted-foreground">
            优先展示站内搜索语句、社区布尔组合、决策搜索组合和推荐入口
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>国家 / 品线</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>主题簇</TableHead>
                <TableHead>站内搜索语句</TableHead>
                <TableHead>社区布尔组合</TableHead>
                <TableHead>决策搜索组合</TableHead>
                <TableHead>推荐入口</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row, idx) => {
                const baseKey = `${row.country}-${row.productLine}-${idx}`;

                return (
                  <TableRow key={baseKey}>
                    <TableCell className="max-w-48 whitespace-normal">
                      <p className="font-medium">{row.country}</p>
                      <p className="text-xs text-muted-foreground mt-1">{row.productLine}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {row.priorityExplanation}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.priority === 'P0' ? 'default' : 'secondary'}>
                        {row.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-44 whitespace-normal text-muted-foreground">
                      {row.topicClusters}
                    </TableCell>
                    <TableCell className="max-w-64 whitespace-normal">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{row.siteSearchQuery}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyText(`${baseKey}-site`, row.siteSearchQuery)}
                        >
                          {copiedKey === `${baseKey}-site` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="ml-1">复制</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64 whitespace-normal">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{row.communityBooleanQuery}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyText(`${baseKey}-community`, row.communityBooleanQuery)}
                        >
                          {copiedKey === `${baseKey}-community` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="ml-1">复制</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64 whitespace-normal">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{row.decisionSearchQuery}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyText(`${baseKey}-decision`, row.decisionSearchQuery)}
                        >
                          {copiedKey === `${baseKey}-decision` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="ml-1">复制</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-72 whitespace-normal text-muted-foreground">
                      {row.recommendedEntries}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
