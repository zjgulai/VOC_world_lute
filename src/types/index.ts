// VOC目的国舆情分析 - 类型定义

// 项目总览
export interface ProjectOverview {
  rawDataRows: number;
  validAnalysisRows: number;
  excludedProductLines: string[];
  top20CountriesCount: number;
  top10CountriesCount: number;
  top10TargetCombinations: number;
  p1Combinations: number;
}

// TOP20国家
export interface Top20Country {
  rank: number;
  country: string;
  countryEn: string;
  sales: number;
  insight: string;
  regionCluster: string;
}

// 品线类型
export type ProductLine = 
  | '护理电器' 
  | '家居出行' 
  | '母婴综合护理' 
  | '内衣服饰' 
  | '喂养电器' 
  | '吸奶器' 
  | '智能母婴电器';

// 国家品线画像
export interface CountryProductProfile {
  country: string;
  productLine: ProductLine;
  persona: string;
  mediaPreference: string;
  purchaseHabit: string;
  brandPreference: string;
  coreCompetitors: string;
  competitorProducts: string;
  marketingPreference: string;
  socialPlatforms: string[];
  communityPlatforms: string[];
  officialPlatforms: string[];
}

// TOP10国家品线
export interface TopCountryProductLine {
  country: string;
  productLine: ProductLine;
  sales: number;
  countryTotalSales: number;
  countryShare: number;
  productRank: number;
  priority: 'P0' | 'P1' | 'P2';
}

// 客群类型
export interface CustomerSegment {
  country: string;
  regionCluster: string;
  purchasingPower: string;
  productLine: ProductLine;
  coreCompetitors: string;
  competitorProducts: string;
  priority: 'P0' | 'P1' | 'P2';
  segmentCode: string;
  segmentName: string;
  lifecycle: string;
  corePainPoints: string;
  mainBarriers: string;
  coreTrustSources: string;
  priorityContentAngles: string;
  priceSensitivity: string;
  localMarketingAngles: string;
  socialPlatforms: string[];
  communityPlatforms: string[];
  officialPlatforms: string[];
  countryJudgment?: string;
  sourceIndex?: string;
}

// 区域Cluster
export interface RegionCluster {
  name: string;
  top20Representatives: string[];
  top20Count: number;
  customerCharacteristics: string;
  trustSources: string;
  contentAngles: string;
  priceStrategy: string;
  channelFocus: string;
  countryDifferences: string;
  priorityActions: string;
}

// 平台入口
export interface PlatformEntry {
  country: string;
  sales: number;
  priorityProductLines: { name: string; sales: number }[];
  coreCompetitors: string;
  competitorProducts: string;
  countryJudgment: string;
  platformType: '社媒传播类' | '垂类社区类' | '垂类官方媒体类';
  platform: string;
  entryPoints: string[];
  accessMethod: string;
  keywordPackage: string;
  samplingSuggestion: string;
  sourceIndex: string;
}

// 信息源质量分层
export interface InfoSourceTier {
  country: string;
  regionCluster: string;
  productLine: ProductLine;
  coreCompetitors: string;
  competitorProducts: string;
  priority: 'P0' | 'P1' | 'P2';
  sampleSegment: string;
  researchQuestionType: string;
  sourceTier: string;
  sourceType: string;
  representativePlatform: string;
  representativeEntry: string;
  fitSegments: string;
  suggestedUsage: string;
  keywordDirection: string;
  acquisitionMethod: string;
  riskDescription: string;
}

// P1搜索清单
export interface P1SearchItem {
  country: string;
  productLine: ProductLine;
  coreCompetitors: string;
  competitorProducts: string;
  sales: number;
  countryTotalSales: number;
  countryShare: number;
  productRank: number;
  priority: 'P0' | 'P1' | 'P2';
  priorityExplanation: string;
  coreProductTerms: string;
  painPointTerms: string;
  scenarioTerms: string;
  decisionTerms: string;
  topicClusters: string;
  recommendedEntries: string;
  siteSearchQuery: string;
  communityBooleanQuery: string;
  decisionSearchQuery: string;
  localLanguageVariants: string;
  recommendedGoogleSearch: string;
  mixedLanguageTestTerms: string;
  entry1: string;
  entry2: string;
  entry3: string;
}

// 导航项
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

// 图表数据
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// 地图数据
export interface MapCountryData {
  country: string;
  isoCode: string;
  sales: number;
  cluster: string;
  productLines: string[];
}
