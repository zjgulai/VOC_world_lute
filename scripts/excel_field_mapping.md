# Excel 到 App 数据映射

## 输入文件

- `02-voc prd/专题2：VOC_目的国VOC舆情分析_业务评审版.xlsx`

## 核心 Sheet 映射

### `项目总览` -> `projectOverview`

- `原始国家×品线行数` -> `rawDataRows`
- `有效分析行数` -> `validAnalysisRows`
- `排除品线` -> `excludedProductLines`
- `TOP20国家数` -> `top20CountriesCount`
- `TOP10国家数` -> `top10CountriesCount`
- `TOP10目标国家×品线组合数` -> `top10TargetCombinations`
- `P1组合数` -> `p1Combinations`

### `TOP20国家深挖` -> `top20Countries`

- `国家` -> `country`
- `销售额` -> `sales`
- `国家洞察` -> `insight`
- `区域cluster` 通过其他 sheet 反查补齐
- `countryEn` 通过现有 fallback 映射补齐

### `全量国家品线画像` -> `countryProductProfiles` / `allCountries` / `mapCountryData`

- `国家` -> `country`
- `产品品线` -> `productLine`
- `身份画像` -> `persona`
- `媒体偏好` -> `mediaPreference`
- `购买习惯` -> `purchaseHabit`
- `品牌偏好` -> `brandPreference`
- `核心竞争品牌（国际/本土）` -> `coreCompetitors`
- `核心竞品产品名称/型号` -> `competitorProducts`
- `营销偏好` -> `marketingPreference`
- `社媒传播类平台` -> `socialPlatforms`
- `垂类社区平台` -> `communityPlatforms`
- `垂类官方媒体平台` -> `officialPlatforms`

### `国家×品线×客群矩阵` -> `customerSegments`

- `国家` -> `country`
- `区域cluster` -> `regionCluster`
- `国家购买力初判` -> `purchasingPower`
- `产品品线` -> `productLine`
- `核心竞争品牌（国际/本土）` -> `coreCompetitors`
- `核心竞品产品名称/型号` -> `competitorProducts`
- `品线优先级` -> `priority`
- `客群编码` -> `segmentCode`
- `客群名称` -> `segmentName`
- `生命周期` -> `lifecycle`
- `核心痛点` -> `corePainPoints`
- `主要阻力` -> `mainBarriers`
- `核心信任来源` -> `coreTrustSources`
- `优先内容切口` -> `priorityContentAngles`
- `价格敏感初判` -> `priceSensitivity`
- `本地化营销切口` -> `localMarketingAngles`
- `社媒传播类平台` -> `socialPlatforms`
- `垂类社区平台` -> `communityPlatforms`
- `垂类官方媒体平台` -> `officialPlatforms`
- `国家本地判断` -> `countryJudgment`
- `来源索引` -> `sourceIndex`

### `区域cluster策略卡` -> `regionClusters`

- `区域cluster` -> `name`
- `TOP20代表国家` -> `top20Representatives`
- `TOP20国家数` -> `top20Count`
- `共性客群特征` -> `customerCharacteristics`
- `共性信任来源` -> `trustSources`
- `共性内容切口` -> `contentAngles`
- `共性价格策略` -> `priceStrategy`
- `渠道与平台侧重` -> `channelFocus`
- `国家差异点` -> `countryDifferences`
- `建议优先动作` -> `priorityActions`

### `TOP10平台入口` -> `platformEntries`

- `国家` -> `country`
- `国家销售额` -> `sales`
- `优先品线` -> `priorityProductLines`
- `核心竞争品牌（国际/本土）` -> `coreCompetitors`
- `核心竞品产品名称/型号` -> `competitorProducts`
- `国家判断` -> `countryJudgment`
- `平台类型` -> `platformType`
- `平台` -> `platform`
- `入口/版块` -> `entryPoints`
- `访问方式` -> `accessMethod`
- `关键词包` -> `keywordPackage`
- `采样建议` -> `samplingSuggestion`
- `来源索引` -> `sourceIndex`

### `信息源质量分层` -> `infoSourceTiers`

- `国家` -> `country`
- `区域cluster` -> `regionCluster`
- `产品品线` -> `productLine`
- `核心竞争品牌（国际/本土）` -> `coreCompetitors`
- `核心竞品产品名称/型号` -> `competitorProducts`
- `品线优先级` -> `priority`
- `样本客群` -> `sampleSegment`
- `研究问题类型` -> `researchQuestionType`
- `来源层级` -> `sourceTier`
- `来源类型` -> `sourceType`
- `代表平台` -> `representativePlatform`
- `代表入口` -> `representativeEntry`
- `适配客群` -> `fitSegments`
- `建议用途` -> `suggestedUsage`
- `关键词方向` -> `keywordDirection`
- `来源获取方式` -> `acquisitionMethod`
- `风险说明` -> `riskDescription`

### `P1搜索清单` -> `p1SearchItems`

- `国家` -> `country`
- `产品品线` -> `productLine`
- `核心竞争品牌（国际/本土）` -> `coreCompetitors`
- `核心竞品产品名称/型号` -> `competitorProducts`
- `销售额` -> `sales`
- `国家总销售额` -> `countryTotalSales`
- `国家内占比` -> `countryShare`
- `品线排名` -> `productRank`
- `抓取优先级` -> `priority`
- `优先级说明` -> `priorityExplanation`
- `核心产品词` -> `coreProductTerms`
- `痛点词` -> `painPointTerms`
- `场景词` -> `scenarioTerms`
- `决策词` -> `decisionTerms`
- `主题簇` -> `topicClusters`
- `推荐入口` -> `recommendedEntries`
- `站内搜索语句` -> `siteSearchQuery`
- `社区布尔组合` -> `communityBooleanQuery`
- `决策搜索组合` -> `decisionSearchQuery`
- `本地语言变体` -> `localLanguageVariants`
- `推荐Google搜索` -> `recommendedGoogleSearch`
- `中英混合测试词` -> `mixedLanguageTestTerms`
- `入口1/2/3` -> `entry1/entry2/entry3`

## 校验原则

- 所有核心 Sheet 必须存在。
- 每个 Sheet 的必需列必须完整，否则生成脚本直接失败。
- `priority` 统一归一到 `P0 | P1 | P2`。
- `platformType` 统一归一到 `社媒传播类 | 垂类社区类 | 垂类官方媒体类`。
- `countryEn` 与 `isoCode` 允许使用当前代码中的 fallback 映射补齐。
