import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { top20Countries, clusterColors } from '@/data/vocData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useState } from 'react';

// Prepare chart data
const chartData = top20Countries.map(c => ({
  name: c.country,
  sales: Math.round(c.sales),
  cluster: c.regionCluster,
  color: clusterColors[c.regionCluster] || '#6b7280',
}));

export function Top20Section() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const totalSales = top20Countries.reduce((sum, c) => sum + c.sales, 0);
  const avgSales = totalSales / top20Countries.length;
  const uniqueClusterCount = new Set(top20Countries.map((c) => c.regionCluster)).size;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">TOP20国家深挖</h2>
          <p className="text-sm text-muted-foreground">
            基于销售额的TOP20国家深度分析与洞察
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TOP20总销售额</p>
                <p className="text-xl font-bold">${(totalSales / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">平均销售额</p>
                <p className="text-xl font-bold">${(avgSales / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">覆盖区域Cluster</p>
                <p className="text-xl font-bold">{uniqueClusterCount}个</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">TOP20国家销售额分布</CardTitle>
          <p className="text-sm text-muted-foreground">颜色代表不同区域Cluster</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis 
                  type="number" 
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    '销售额'
                  ]}
                  labelFormatter={(label: string) => `${label} (${chartData.find(c => c.name === label)?.cluster})`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  radius={[0, 4, 4, 0]}
                  onMouseEnter={(_, index) => setHoveredCountry(chartData[index].name)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      opacity={hoveredCountry === null || hoveredCountry === entry.name ? 1 : 0.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {top20Countries.slice(0, 10).map((country) => (
          <Card 
            key={country.country} 
            className="card-shadow hover:card-shadow-hover transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${country.rank <= 3 ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'}
                  `}>
                    {country.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{country.country}</h4>
                    <p className="text-xs text-muted-foreground">{country.countryEn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${(country.sales / 1000).toFixed(0)}K</p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1"
                    style={{ 
                      backgroundColor: `${clusterColors[country.regionCluster]}20`,
                      color: clusterColors[country.regionCluster]
                    }}
                  >
                    {country.regionCluster}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {country.insight}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button for remaining countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {top20Countries.slice(10).map((country) => (
          <Card 
            key={country.country} 
            className="card-shadow hover:card-shadow-hover transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {country.rank}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{country.country}</h4>
                    <p className="text-xs text-muted-foreground">{country.countryEn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${(country.sales / 1000).toFixed(0)}K</p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1"
                    style={{ 
                      backgroundColor: `${clusterColors[country.regionCluster]}20`,
                      color: clusterColors[country.regionCluster]
                    }}
                  >
                    {country.regionCluster}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {country.insight}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
