import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { ShieldCheck, Filter, Database, SearchCheck } from 'lucide-react';
import { infoSourceTiers, clusterColors } from '@/data/vocData';

const ALL = '__ALL__';

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function InfoSourceQualitySection() {
  const [selectedCountry, setSelectedCountry] = useState(ALL);
  const [selectedCluster, setSelectedCluster] = useState(ALL);
  const [selectedProductLine, setSelectedProductLine] = useState(ALL);
  const [selectedTier, setSelectedTier] = useState(ALL);
  const [selectedQuestionType, setSelectedQuestionType] = useState(ALL);

  const countries = useMemo(() => uniqueValues(infoSourceTiers.map((item) => item.country)), []);
  const clusters = useMemo(() => uniqueValues(infoSourceTiers.map((item) => item.regionCluster)), []);
  const productLines = useMemo(() => uniqueValues(infoSourceTiers.map((item) => item.productLine)), []);
  const sourceTiers = useMemo(() => uniqueValues(infoSourceTiers.map((item) => item.sourceTier)), []);
  const questionTypes = useMemo(
    () => uniqueValues(infoSourceTiers.map((item) => item.researchQuestionType)),
    []
  );

  const filteredRows = useMemo(
    () =>
      infoSourceTiers.filter((item) => {
        if (selectedCountry !== ALL && item.country !== selectedCountry) return false;
        if (selectedCluster !== ALL && item.regionCluster !== selectedCluster) return false;
        if (selectedProductLine !== ALL && item.productLine !== selectedProductLine) return false;
        if (selectedTier !== ALL && item.sourceTier !== selectedTier) return false;
        if (selectedQuestionType !== ALL && item.researchQuestionType !== selectedQuestionType) return false;
        return true;
      }),
    [selectedCountry, selectedCluster, selectedProductLine, selectedTier, selectedQuestionType]
  );

  const tierCount = uniqueValues(filteredRows.map((item) => item.sourceTier)).length;
  const platformCount = uniqueValues(filteredRows.map((item) => item.representativePlatform)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">信息源质量分层</h2>
          <p className="text-sm text-muted-foreground">
            按国家、cluster、品线与研究问题类型管理来源层级与风险
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">来源记录数</p>
                <p className="text-xl font-bold">{filteredRows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Filter className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">来源层级数</p>
                <p className="text-xl font-bold">{tierCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <SearchCheck className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">代表平台数</p>
                <p className="text-xl font-bold">{platformCount}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full"><SelectValue placeholder="国家" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部国家</SelectItem>
                {countries.map((country) => <SelectItem key={country} value={country}>{country}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedCluster} onValueChange={setSelectedCluster}>
              <SelectTrigger className="w-full"><SelectValue placeholder="区域Cluster" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部区域</SelectItem>
                {clusters.map((cluster) => <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedProductLine} onValueChange={setSelectedProductLine}>
              <SelectTrigger className="w-full"><SelectValue placeholder="产品品线" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部品线</SelectItem>
                {productLines.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full"><SelectValue placeholder="来源层级" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部层级</SelectItem>
                {sourceTiers.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
              <SelectTrigger className="w-full"><SelectValue placeholder="研究问题类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>全部问题类型</SelectItem>
                {questionTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">来源层级明细</CardTitle>
          <p className="text-sm text-muted-foreground">
            展示代表平台、研究用途、获取方式与风险说明
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>国家</TableHead>
                <TableHead>区域</TableHead>
                <TableHead>品线</TableHead>
                <TableHead>问题类型</TableHead>
                <TableHead>来源层级</TableHead>
                <TableHead>来源类型</TableHead>
                <TableHead>代表平台 / 入口</TableHead>
                <TableHead>建议用途</TableHead>
                <TableHead>风险说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((row, idx) => (
                <TableRow key={`${row.country}-${row.productLine}-${row.representativePlatform}-${idx}`}>
                  <TableCell className="font-medium">{row.country}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${clusterColors[row.regionCluster] || '#6b7280'}20`,
                        color: clusterColors[row.regionCluster] || '#6b7280',
                      }}
                    >
                      {row.regionCluster}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.productLine}</TableCell>
                  <TableCell className="max-w-44 whitespace-normal">{row.researchQuestionType}</TableCell>
                  <TableCell>{row.sourceTier}</TableCell>
                  <TableCell>{row.sourceType}</TableCell>
                  <TableCell className="max-w-52 whitespace-normal">
                    <p className="font-medium">{row.representativePlatform}</p>
                    <p className="text-xs text-muted-foreground mt-1">{row.representativeEntry}</p>
                  </TableCell>
                  <TableCell className="max-w-56 whitespace-normal text-muted-foreground">
                    {row.suggestedUsage}
                  </TableCell>
                  <TableCell className="max-w-56 whitespace-normal text-muted-foreground">
                    {row.riskDescription}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
