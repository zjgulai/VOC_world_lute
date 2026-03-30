import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { KnowledgeGraph } from '@/components/insights/KnowledgeGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, MapPin, Package, Search, SlidersHorizontal, Users, Waypoints } from 'lucide-react';
import {
  allCountries,
  mapCountryData,
  clusterColors,
  productLineColors,
  productLines,
  regionClusters,
  top20Countries,
  countryProductProfiles,
  customerSegments,
} from '@/data/vocData';
import type { ProductLine } from '@/types';
import { useEffect, useMemo, useState } from 'react';

const ALL = '__ALL__';

const WORLD_REGIONS = [
  { name: '美国', x: 180, y: 120, r: 12 },
  { name: '加拿大', x: 180, y: 80, r: 10 },
  { name: '墨西哥', x: 170, y: 160, r: 8 },
  { name: '巴西', x: 220, y: 220, r: 8 },
  { name: '阿根廷', x: 210, y: 280, r: 6 },
  { name: '智利', x: 200, y: 270, r: 5 },
  { name: '秘鲁', x: 190, y: 230, r: 5 },
  { name: '哥伦比亚', x: 185, y: 200, r: 5 },
  { name: '英国', x: 380, y: 80, r: 6 },
  { name: '德国', x: 400, y: 90, r: 6 },
  { name: '法国', x: 385, y: 100, r: 6 },
  { name: '西班牙', x: 375, y: 115, r: 6 },
  { name: '意大利', x: 405, y: 110, r: 6 },
  { name: '荷兰', x: 395, y: 80, r: 5 },
  { name: '比利时', x: 390, y: 85, r: 5 },
  { name: '奥地利', x: 410, y: 95, r: 5 },
  { name: '瑞典', x: 410, y: 55, r: 5 },
  { name: '挪威', x: 400, y: 50, r: 5 },
  { name: '丹麦', x: 405, y: 70, r: 4 },
  { name: '芬兰', x: 425, y: 50, r: 4 },
  { name: '波兰', x: 420, y: 90, r: 5 },
  { name: '希腊', x: 425, y: 115, r: 4 },
  { name: '葡萄牙', x: 365, y: 110, r: 4 },
  { name: '俄罗斯', x: 480, y: 60, r: 10 },
  { name: '中国', x: 580, y: 110, r: 12 },
  { name: '日本', x: 630, y: 105, r: 6 },
  { name: '印度', x: 540, y: 150, r: 8 },
  { name: '印尼', x: 580, y: 190, r: 7 },
  { name: '泰国', x: 570, y: 160, r: 6 },
  { name: '越南', x: 575, y: 165, r: 5 },
  { name: '马来西亚', x: 575, y: 180, r: 5 },
  { name: '菲律宾', x: 600, y: 160, r: 5 },
  { name: '阿联酋', x: 480, y: 140, r: 5 },
  { name: '沙特阿拉伯', x: 470, y: 145, r: 6 },
  { name: '土耳其', x: 440, y: 115, r: 6 },
  { name: '南非', x: 420, y: 260, r: 6 },
  { name: '埃及', x: 440, y: 140, r: 5 },
  { name: '澳大利亚', x: 650, y: 250, r: 8 },
  { name: '新西兰', x: 680, y: 270, r: 5 },
];

function topLabels(values: string[], limit = 6) {
  const counts = new Map<string, number>();
  values
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
    .slice(0, limit)
    .map(([label]) => label);
}

function priorityWeight(priority: string) {
  if (priority === 'P0') return 0;
  if (priority === 'P1') return 1;
  return 2;
}

function SimpleWorldMap({
  data,
  selectedCluster,
}: {
  data: typeof mapCountryData;
  selectedCluster: string | null;
}) {
  const getCountryData = (name: string) => data.find((item) => item.country === name);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-muted/30">
      <svg viewBox="0 0 750 350" className="h-full w-full">
        <g fill="hsl(var(--muted))" opacity="0.3">
          <path d="M120,40 L250,40 L280,180 L150,200 L100,150 Z" />
          <path d="M180,200 L280,200 L260,320 L200,300 Z" />
          <path d="M350,50 L480,50 L470,130 L360,130 Z" />
          <path d="M360,140 L480,140 L470,280 L380,260 Z" />
          <path d="M490,50 L700,50 L720,200 L550,200 L500,150 Z" />
          <path d="M620,220 L720,220 L710,300 L630,290 Z" />
        </g>

        {WORLD_REGIONS.map((region) => {
          const countryData = getCountryData(region.name);
          const cluster = countryData?.cluster ?? null;
          const isHighlighted = !selectedCluster || cluster === selectedCluster;
          const hasData = Boolean(countryData);

          return (
            <g key={region.name}>
              <circle
                cx={region.x}
                cy={region.y}
                r={hasData ? region.r : region.r * 0.6}
                fill={hasData ? clusterColors[cluster || ''] || '#6b7280' : '#9ca3af'}
                opacity={isHighlighted ? (hasData ? 0.9 : 0.35) : 0.1}
                className="transition-all duration-300"
              />
              {hasData && isHighlighted && (
                <text
                  x={region.x}
                  y={region.y + region.r + 10}
                  textAnchor="middle"
                  fontSize="8"
                  fill="hsl(var(--foreground))"
                  opacity={0.85}
                >
                  {region.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 right-2 rounded-lg bg-card/90 p-2 text-xs backdrop-blur-sm">
        <p className="mb-1 font-medium">区域 Cluster</p>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {Object.entries(clusterColors).slice(0, 6).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CountriesSection() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(mapCountryData[0]?.country ?? null);
  const [selectedProductLine, setSelectedProductLine] = useState<ProductLine | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState(ALL);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState(ALL);
  const [sortMode, setSortMode] = useState<'country' | 'sales' | 'products'>('sales');

  const countryPriorityMap = useMemo(() => {
    const priorityMap = new Map<string, 'P0' | 'P1' | 'P2'>();

    customerSegments.forEach((segment) => {
      const current = priorityMap.get(segment.country);
      if (!current || priorityWeight(segment.priority) < priorityWeight(current)) {
        priorityMap.set(segment.country, segment.priority);
      }
    });

    return priorityMap;
  }, []);

  const filteredCountries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return mapCountryData
      .filter((country) => {
        if (selectedCluster && country.cluster !== selectedCluster) return false;
        if (selectedProductFilter !== ALL && !country.productLines.includes(selectedProductFilter)) return false;

        const priority = countryPriorityMap.get(country.country) ?? 'P2';
        if (selectedPriorityFilter !== ALL && priority !== selectedPriorityFilter) return false;

        if (!keyword) return true;

        return (
          country.country.toLowerCase().includes(keyword) ||
          country.cluster.toLowerCase().includes(keyword) ||
          country.productLines.some((item) => item.toLowerCase().includes(keyword))
        );
      })
      .sort((a, b) => {
        if (sortMode === 'country') return a.country.localeCompare(b.country, 'zh-CN');
        if (sortMode === 'products') return b.productLines.length - a.productLines.length || a.country.localeCompare(b.country, 'zh-CN');
        return b.sales - a.sales || a.country.localeCompare(b.country, 'zh-CN');
      });
  }, [countryPriorityMap, searchKeyword, selectedCluster, selectedPriorityFilter, selectedProductFilter, sortMode]);

  useEffect(() => {
    if (filteredCountries.length === 0) {
      setSelectedCountry(null);
      return;
    }

    if (!selectedCountry || !filteredCountries.some((country) => country.country === selectedCountry)) {
      setSelectedCountry(filteredCountries[0].country);
    }
  }, [filteredCountries, selectedCountry]);

  const selectedCountryData = useMemo(
    () => filteredCountries.find((country) => country.country === selectedCountry) ?? null,
    [filteredCountries, selectedCountry]
  );
  const selectedTop20 = useMemo(
    () => top20Countries.find((country) => country.country === selectedCountry) ?? null,
    [selectedCountry]
  );
  const selectedClusterStrategy = useMemo(
    () => regionClusters.find((cluster) => cluster.name === selectedCountryData?.cluster) ?? null,
    [selectedCountryData]
  );
  const selectedProfiles = useMemo(() => {
    if (!selectedCountry) {
      return [];
    }

    return countryProductProfiles
      .filter((profile) => profile.country === selectedCountry)
      .sort((a, b) => productLines.indexOf(a.productLine) - productLines.indexOf(b.productLine));
  }, [selectedCountry]);
  const selectedSegments = useMemo(
    () => customerSegments.filter((segment) => segment.country === selectedCountry),
    [selectedCountry]
  );

  useEffect(() => {
    if (selectedProfiles.length === 0) {
      setSelectedProductLine(null);
      return;
    }

    if (!selectedProductLine || !selectedProfiles.some((profile) => profile.productLine === selectedProductLine)) {
      setSelectedProductLine(selectedProfiles[0].productLine);
    }
  }, [selectedProductLine, selectedProfiles]);

  const activeProfile =
    selectedProfiles.find((profile) => profile.productLine === selectedProductLine) ?? selectedProfiles[0] ?? null;
  const activeSegment =
    selectedSegments.find((segment) => segment.productLine === activeProfile?.productLine) ?? selectedSegments[0] ?? null;
  const activePlatforms = activeProfile
    ? topLabels([
        ...activeProfile.socialPlatforms,
        ...activeProfile.communityPlatforms,
        ...activeProfile.officialPlatforms,
      ])
    : [];
  const countryKnowledgeGraph = useMemo(() => {
    if (!selectedCountryData) {
      return { nodes: [], edges: [] };
    }

    const nodes: Array<{
      id: string;
      label: string;
      group: 'core' | 'cluster' | 'product' | 'segment' | 'platform';
      meta?: string;
    }> = [
      {
        id: `country-${selectedCountryData.country}`,
        label: selectedCountryData.country,
        group: 'core',
        meta: `${selectedCountryData.cluster} · 覆盖 ${selectedCountryData.productLines.length} 个品线`,
      },
    ];

    const edges: Array<{ source: string; target: string }> = [];
    const coreId = `country-${selectedCountryData.country}`;

    if (selectedCountryData.cluster) {
      const clusterId = `cluster-${selectedCountryData.cluster}`;
      nodes.push({
        id: clusterId,
        label: selectedCountryData.cluster,
        group: 'cluster',
        meta: selectedClusterStrategy?.channelFocus ?? '区域 Cluster 归属',
      });
      edges.push({ source: coreId, target: clusterId });
    }

    selectedProfiles.slice(0, 4).forEach((profile) => {
      const productId = `product-${profile.productLine}`;
      nodes.push({
        id: productId,
        label: profile.productLine,
        group: 'product',
        meta: profile.persona || profile.purchaseHabit || '国家画像品线',
      });
      edges.push({ source: coreId, target: productId });

      const relatedSegment = selectedSegments.find((segment) => segment.productLine === profile.productLine);
      if (relatedSegment) {
        const segmentId = `segment-${relatedSegment.segmentCode}`;
        if (!nodes.some((node) => node.id === segmentId)) {
          nodes.push({
            id: segmentId,
            label: relatedSegment.segmentCode,
            group: 'segment',
            meta: relatedSegment.segmentName,
          });
          edges.push({ source: coreId, target: segmentId });
        }
        edges.push({ source: productId, target: segmentId });
      }
    });

    activePlatforms.slice(0, 5).forEach((platform) => {
      const platformId = `platform-${platform}`;
      nodes.push({
        id: platformId,
        label: platform,
        group: 'platform',
        meta: '高频平台标签',
      });
      edges.push({ source: coreId, target: platformId });
    });

    return { nodes, edges };
  }, [activePlatforms, selectedClusterStrategy, selectedCountryData, selectedProfiles, selectedSegments]);

  const coveredCountryCount = allCountries.length;
  const clusterCount = regionClusters.length;
  const profileCombinationCount = countryProductProfiles.length;
  const p0CountryCount = new Set(
    customerSegments.filter((segment) => segment.priority === 'P0').map((segment) => segment.country)
  ).size;
  const visibleCountryCount = filteredCountries.length;
  const visibleClusters = new Set(filteredCountries.map((country) => country.cluster)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Globe className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">国家画像</h2>
          <p className="text-sm text-muted-foreground">
            {coveredCountryCount}个国家、{profileCombinationCount}条国家×品线画像与 Cluster 分布
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">覆盖国家</p>
                <p className="text-xl font-bold">{coveredCountryCount}个</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">画像组合</p>
                <p className="text-xl font-bold">{profileCombinationCount}条</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <MapPin className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前可见 Cluster</p>
                <p className="text-xl font-bold">{visibleClusters}/{clusterCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                <Users className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">P0国家 / 当前可见</p>
                <p className="text-xl font-bold">{p0CountryCount} / {visibleCountryCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            分析筛选台
          </CardTitle>
          <p className="text-sm text-muted-foreground">支持关键词、品线、优先级与排序组合查看国家画像</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="搜索国家、Cluster 或品线"
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedProductFilter} onValueChange={setSelectedProductFilter}>
              <SelectTrigger>
                <SelectValue placeholder="筛选品线" />
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
            <Select value={selectedPriorityFilter} onValueChange={setSelectedPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="国家优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部优先级</SelectItem>
                <SelectItem value="P0">P0</SelectItem>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortMode} onValueChange={(value) => setSortMode(value as 'country' | 'sales' | 'products')}>
              <SelectTrigger>
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">按销售额</SelectItem>
                <SelectItem value="products">按覆盖品线数</SelectItem>
                <SelectItem value="country">按国家名称</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">全球国家分布图</CardTitle>
          <p className="text-sm text-muted-foreground">按 Cluster 过滤后，可联动下方国家深描与品线画像</p>
        </CardHeader>
        <CardContent>
          <SimpleWorldMap data={mapCountryData} selectedCluster={selectedCluster} />
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant={selectedCluster === null ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedCluster(null)}
            >
              全部
            </Badge>
            {Object.entries(clusterColors).map(([cluster, color]) => (
              <Badge
                key={cluster}
                variant={selectedCluster === cluster ? 'default' : 'secondary'}
                className="cursor-pointer"
                style={selectedCluster === cluster ? { backgroundColor: color } : {}}
                onClick={() => setSelectedCluster(cluster === selectedCluster ? null : cluster)}
              >
                {cluster}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCountryData && (
        <Card className="card-shadow">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg font-semibold">{selectedCountryData.country}</CardTitle>
                  <Badge variant="secondary">{selectedCountryData.cluster}</Badge>
                  <Badge variant={countryPriorityMap.get(selectedCountryData.country) === 'P0' ? 'default' : 'secondary'}>
                    {countryPriorityMap.get(selectedCountryData.country) ?? 'P2'}
                  </Badge>
                  {selectedTop20 && <Badge>{`TOP${selectedTop20.rank} 市场`}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTop20?.insight ?? activeSegment?.countryJudgment ?? '当前国家暂无 TOP20 洞察文案，以下为画像与客群数据明细。'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-right text-sm">
                <div>
                  <p className="text-muted-foreground">覆盖品线</p>
                  <p className="font-semibold">{selectedCountryData.productLines.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">客群段数</p>
                  <p className="font-semibold">{selectedSegments.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">TOP20销售额</p>
                  <p className="font-semibold">
                    {selectedTop20 ? `$${(selectedTop20.sales / 1000).toFixed(1)}K` : '--'}
                  </p>
                </div>
              </div>
            </div>

            {selectedClusterStrategy && (
              <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Cluster 客群特征</p>
                  <p className="mt-1 text-sm">{selectedClusterStrategy.customerCharacteristics}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">共性信任来源</p>
                  <p className="mt-1 text-sm">{selectedClusterStrategy.trustSources}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">渠道侧重</p>
                  <p className="mt-1 text-sm">{selectedClusterStrategy.channelFocus}</p>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {countryKnowledgeGraph.nodes.length > 1 && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <Card className="border-none bg-muted/20 shadow-none">
                  <CardContent className="p-4">
                    <KnowledgeGraph
                      title="国家画像知识图谱"
                      description="把国家、Cluster、品线、客群和高频平台串成一张业务关系图；可悬浮或点击节点查看直连关系。"
                      nodes={countryKnowledgeGraph.nodes}
                      edges={countryKnowledgeGraph.edges}
                    />
                  </CardContent>
                </Card>

                <InsightCallout
                  title="图谱解读"
                  icon={<Waypoints className="h-4 w-4 text-primary" />}
                  summary={`这张图谱不是因果网络，而是当前国家在结构化数据中的业务关系视图，适合快速定位“哪个品线对应哪个客群、依赖哪些平台与区域策略”。`}
                  bullets={[
                    '先看中心国家节点，再看其外圈的 Cluster、品线和客群节点，快速判断策略结构是否清晰。',
                    '如果同一国家同时连接多个品线与多个客群，说明它更适合作为跨品线运营或内容协同市场。',
                    '平台节点越集中，说明该国家的内容触达与验证路径越清晰，适合优先做平台侧本地化优化。',
                    '悬浮或点击任一节点后，优先观察右侧“直连关系”，它代表当前国家画像中最直接的业务连接。',
                  ]}
                  scopeNote="范围说明：该图谱基于当前筛选国家的结构化画像、客群和平台标签生成，用于关系理解与叙事辅助。"
                />
              </div>
            )}

            {selectedProfiles.length > 0 ? (
              <Tabs
                value={activeProfile?.productLine}
                onValueChange={(value) => setSelectedProductLine(value as ProductLine)}
                className="w-full"
              >
                <TabsList className="mb-4 flex h-auto flex-wrap">
                  {selectedProfiles.map((profile) => (
                    <TabsTrigger key={profile.productLine} value={profile.productLine} className="text-sm">
                      {profile.productLine}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {selectedProfiles.map((profile) => {
                  const segment =
                    selectedSegments.find((item) => item.productLine === profile.productLine) ?? activeSegment;

                  return (
                    <TabsContent key={profile.productLine} value={profile.productLine} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-none bg-muted/30 shadow-none">
                          <CardContent className="space-y-3 p-4">
                            <div>
                              <p className="text-xs text-muted-foreground">身份画像</p>
                              <p className="mt-1 text-sm">{profile.persona || '暂无'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">购买习惯</p>
                              <p className="mt-1 text-sm">{profile.purchaseHabit || '暂无'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">品牌偏好</p>
                              <p className="mt-1 text-sm">{profile.brandPreference || '暂无'}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-none bg-muted/30 shadow-none">
                          <CardContent className="space-y-3 p-4">
                            <div>
                              <p className="text-xs text-muted-foreground">媒体偏好</p>
                              <p className="mt-1 text-sm">{profile.mediaPreference || '暂无'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">营销偏好</p>
                              <p className="mt-1 text-sm">{profile.marketingPreference || '暂无'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">核心竞品</p>
                              <p className="mt-1 text-sm">
                                {profile.coreCompetitors || '暂无'}
                                {profile.competitorProducts ? ` | ${profile.competitorProducts}` : ''}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {segment && (
                        <div className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs text-muted-foreground">核心痛点</p>
                            <p className="mt-1 text-sm">{segment.corePainPoints || '暂无'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">主要阻力</p>
                            <p className="mt-1 text-sm">{segment.mainBarriers || '暂无'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">信任来源</p>
                            <p className="mt-1 text-sm">{segment.coreTrustSources || '暂无'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">优先内容切口</p>
                            <p className="mt-1 text-sm">{segment.priorityContentAngles || '暂无'}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="mb-2 text-sm font-medium">社媒传播类</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.socialPlatforms.length > 0 ? (
                              profile.socialPlatforms.map((platform) => (
                                <Badge key={platform} variant="secondary">
                                  {platform}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">暂无</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-sm font-medium">垂类社区</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.communityPlatforms.length > 0 ? (
                              profile.communityPlatforms.map((platform) => (
                                <Badge key={platform} variant="secondary">
                                  {platform}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">暂无</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-sm font-medium">官方/专业媒体</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.officialPlatforms.length > 0 ? (
                              profile.officialPlatforms.map((platform) => (
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

                      {activePlatforms.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-medium">高频平台标签</p>
                          <div className="flex flex-wrap gap-2">
                            {activePlatforms.map((platform) => (
                              <Badge key={platform} className="bg-primary/10 text-primary hover:bg-primary/10">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            ) : (
              <p className="text-sm text-muted-foreground">当前筛选下暂无国家画像数据。</p>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">网格视图</TabsTrigger>
          <TabsTrigger value="list">列表视图</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredCountries.map((country) => {
              const isSelected = country.country === selectedCountry;

              return (
                <Card
                  key={country.country}
                  className={`cursor-pointer transition-all hover:card-shadow-hover ${isSelected ? 'ring-2 ring-primary/40' : 'card-shadow'}`}
                  onClick={() => setSelectedCountry(country.country)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: clusterColors[country.cluster] }}
                      />
                      <span className="truncate text-sm font-medium">{country.country}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {country.productLines.slice(0, 2).map((productLine) => (
                        <span key={productLine} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                          {productLine}
                        </span>
                      ))}
                      {country.productLines.length > 2 && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                          +{country.productLines.length - 2}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="card-shadow">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredCountries.map((country) => (
                  <div
                    key={country.country}
                    className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50 ${
                      country.country === selectedCountry ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedCountry(country.country)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: clusterColors[country.cluster] }}
                      />
                      <span className="font-medium">{country.country}</span>
                      <Badge variant="secondary" className="text-xs">
                        {country.cluster}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {country.productLines.map((productLine) => (
                        <span
                          key={productLine}
                          className="rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: `${productLineColors[productLine as ProductLine]}20`,
                            color: productLineColors[productLine as ProductLine],
                          }}
                        >
                          {productLine}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">全量国家列表</CardTitle>
          <p className="text-sm text-muted-foreground">{coveredCountryCount}个国家覆盖全球主要市场</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6 lg:grid-cols-9">
            {allCountries.map((country) => {
              const countryData = mapCountryData.find((item) => item.country === country);
              const isSelected = country === selectedCountry;

              return (
                <div
                  key={country}
                  className={`truncate rounded px-2 py-1.5 text-center text-sm ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : countryData
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                  title={countryData ? `${country} - ${countryData.cluster}` : country}
                >
                  {country}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
