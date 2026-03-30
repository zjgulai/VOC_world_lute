import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InsightCallout } from '@/components/insights/InsightCallout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Share2,
  MessageCircle,
  Users,
  Globe,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Search,
  Link2,
  BarChart3,
} from 'lucide-react';
import { platformEntries, top20Countries } from '@/data/vocData';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const socialIcons: Record<string, React.ElementType> = {
  Instagram,
  Facebook,
  YouTube: Youtube,
  TikTok: Share2,
  Twitter,
  Pinterest: ExternalLink,
  Snapchat: MessageCircle,
  Reddit: MessageCircle,
};

const platformTypeMeta = {
  社媒传播类: {
    title: '社媒传播类',
    description: '短视频、图文、话题标签与内容种草平台',
    icon: Share2,
    accent: 'bg-blue-500/10 text-blue-500',
  },
  垂类社区类: {
    title: '垂类社区类',
    description: '论坛、问答、妈妈群与经验分享社区',
    icon: Users,
    accent: 'bg-green-500/10 text-green-500',
  },
  垂类官方媒体类: {
    title: '垂类官方媒体类',
    description: '官方育儿媒体、机构站点与权威内容入口',
    icon: Globe,
    accent: 'bg-purple-500/10 text-purple-500',
  },
} as const;

const countryTabs = Array.from(new Set(platformEntries.map((item) => item.country)));

function getCountryEnglishName(country: string) {
  return top20Countries.find((item) => item.country === country)?.countryEn ?? country;
}

function getCountrySales(country: string) {
  const first = platformEntries.find((item) => item.country === country);
  return first?.sales ?? 0;
}

function getCountryJudgment(country: string) {
  const first = platformEntries.find((item) => item.country === country);
  return first?.countryJudgment ?? '暂无国家策略判断。';
}

function groupCountryEntries(country: string) {
  return {
    社媒传播类: platformEntries.filter((item) => item.country === country && item.platformType === '社媒传播类'),
    垂类社区类: platformEntries.filter((item) => item.country === country && item.platformType === '垂类社区类'),
    垂类官方媒体类: platformEntries.filter((item) => item.country === country && item.platformType === '垂类官方媒体类'),
  };
}

export function PlatformsSection() {
  const topCountriesByPlatformCount = [...countryTabs]
    .map((country) => ({
      country,
      count: platformEntries.filter((item) => item.country === country).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const platformStructureData = [...countryTabs]
    .map((country) => {
      const entries = platformEntries.filter((item) => item.country === country);
      const totalEntries = entries.length || 1;
      const socialCount = entries.filter((item) => item.platformType === '社媒传播类').length;
      const communityCount = entries.filter((item) => item.platformType === '垂类社区类').length;
      const officialCount = entries.filter((item) => item.platformType === '垂类官方媒体类').length;

      return {
        country,
        totalEntries,
        sales: getCountrySales(country),
        socialCount,
        communityCount,
        officialCount,
        socialShare: (socialCount / totalEntries) * 100,
        communityShare: (communityCount / totalEntries) * 100,
        officialShare: (officialCount / totalEntries) * 100,
      };
    })
    .sort((a, b) => b.sales - a.sales);
  const mostSocialDriven = [...platformStructureData].sort((a, b) => b.socialShare - a.socialShare)[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Share2 className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">平台入口</h2>
          <p className="text-sm text-muted-foreground">
            基于 Excel 的 TOP10 国家 VOC 抓取平台入口与关键词策略
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(platformTypeMeta).map(([key, meta]) => {
          const Icon = meta.icon;
          const count = platformEntries.filter((item) => item.platformType === key).length;

          return (
            <Card key={key} className="card-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{meta.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {count} 条入口记录
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              国家 × 平台类型结构占比
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              对比不同国家更依赖社媒种草、社区验证还是官方媒体背书。
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformStructureData} layout="vertical" margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="country" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number, name: string, item) => {
                      const payload = item.payload as {
                        socialCount: number;
                        communityCount: number;
                        officialCount: number;
                      };
                      const countMap: Record<string, number> = {
                        socialShare: payload.socialCount,
                        communityShare: payload.communityCount,
                        officialShare: payload.officialCount,
                      };

                      return [`${value.toFixed(1)}% (${countMap[name] ?? 0} 条入口)`, name];
                    }}
                    labelFormatter={(label) => `${label} 平台结构`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="socialShare" stackId="platformMix" fill="#3b82f6" name="socialShare" />
                  <Bar dataKey="communityShare" stackId="platformMix" fill="#10b981" name="communityShare" />
                  <Bar dataKey="officialShare" stackId="platformMix" fill="#8b5cf6" name="officialShare" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <InsightCallout
          title="平台结构洞察"
          icon={<Share2 className="h-4 w-4 text-primary" />}
          summary={
            mostSocialDriven
              ? `${mostSocialDriven.country} 当前最偏向社媒传播类入口，说明这一市场更适合先做内容种草与社媒投放，再引导进入社区或官方站完成验证。`
              : '当前平台结构数据不足以形成明确判断。'
          }
          bullets={[
            '社媒占比高的国家更适合先做短内容和 KOL/KOC 触达，再承接站内搜索与评论验证。',
            '社区占比高的国家说明妈妈群体更重视经验交换与真实案例，问答型内容与布尔搜索更重要。',
            '官方媒体占比高的国家更适合强化专家背书、认证和机构型内容入口。',
          ]}
          scopeNote="范围说明：该图按当前平台入口配置条数做结构占比，不代表真实平台流量份额。"
        />
      </div>

      <Tabs defaultValue={countryTabs[0]} className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto">
          {countryTabs.map((country) => (
            <TabsTrigger key={country} value={country} className="text-sm">
              {country}
            </TabsTrigger>
          ))}
        </TabsList>

        {countryTabs.map((country) => {
          const grouped = groupCountryEntries(country);
          const sales = getCountrySales(country);

          return (
            <TabsContent key={country} value={country}>
              <div className="space-y-4">
                <Card className="card-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{country}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getCountryEnglishName(country)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${(sales / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground">国家销售额</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(grouped).map(([platformType, entries]) => {
                    const meta = platformTypeMeta[platformType as keyof typeof platformTypeMeta];
                    const Icon = meta.icon;

                    return (
                      <Card key={platformType} className="card-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.accent}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <CardTitle className="text-base">{meta.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {entries.map((entry) => {
                              const SocialIcon = socialIcons[entry.platform] || ExternalLink;

                              return (
                                <div
                                  key={`${entry.platformType}-${entry.platform}-${entry.sourceIndex}`}
                                  className="rounded-lg border border-border p-3 space-y-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <SocialIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">{entry.platform}</span>
                                  </div>

                                  <div className="flex flex-wrap gap-1.5">
                                    {entry.entryPoints.map((point) => (
                                      <Badge key={point} variant="secondary" className="text-[10px]">
                                        {point}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-start gap-1.5">
                                      <Link2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                      <span className="line-clamp-2">{entry.accessMethod}</span>
                                    </div>
                                    <div className="flex items-start gap-1.5">
                                      <Search className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                      <span className="line-clamp-2">{entry.keywordPackage}</span>
                                    </div>
                                  </div>

                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {entry.samplingSuggestion}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="card-shadow border-l-4 border-l-indigo-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">平台策略建议</h4>
                    <p className="text-sm text-muted-foreground">{getCountryJudgment(country)}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">平台覆盖概览</CardTitle>
          <p className="text-sm text-muted-foreground">按国家统计已配置的平台入口数量</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCountriesByPlatformCount.map((item) => (
              <div key={item.country} className="p-3 bg-muted/40 rounded-lg">
                <p className="font-medium text-sm">{item.country}</p>
                <p className="text-2xl font-bold mt-1">{item.count}</p>
                <p className="text-xs text-muted-foreground mt-1">已配置平台入口条数</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
