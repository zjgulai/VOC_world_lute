#!/usr/bin/env python3
"""Convert the VOC Excel workbook into a typed TS data module."""

from __future__ import annotations

import json
import math
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd


APP_ROOT = Path(__file__).resolve().parents[1]
REPORT_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_EXCEL = REPORT_ROOT / "02-voc prd" / "专题2：VOC_目的国VOC舆情分析_业务评审版.xlsx"
DEFAULT_OUTPUT = APP_ROOT / "src" / "data" / "vocData.generated.ts"


EXPECTED_COLUMNS = {
    "项目总览": ["项目", "数值"],
    "全量国家品线画像": [
        "国家",
        "产品品线",
        "身份画像",
        "媒体偏好",
        "购买习惯",
        "品牌偏好",
        "核心竞争品牌（国际/本土）",
        "核心竞品产品名称/型号",
        "营销偏好",
        "社媒传播类平台",
        "垂类社区平台",
        "垂类官方媒体平台",
    ],
    "TOP20国家深挖": ["国家", "销售额", "国家洞察"],
    "国家×品线×客群矩阵": [
        "国家",
        "区域cluster",
        "国家购买力初判",
        "产品品线",
        "核心竞争品牌（国际/本土）",
        "核心竞品产品名称/型号",
        "品线优先级",
        "客群编码",
        "客群名称",
        "生命周期",
        "核心痛点",
        "主要阻力",
        "核心信任来源",
        "优先内容切口",
        "价格敏感初判",
        "本地化营销切口",
        "社媒传播类平台",
        "垂类社区平台",
        "垂类官方媒体平台",
        "国家本地判断",
        "来源索引",
    ],
    "区域cluster策略卡": [
        "区域cluster",
        "TOP20代表国家",
        "TOP20国家数",
        "共性客群特征",
        "共性信任来源",
        "共性内容切口",
        "共性价格策略",
        "渠道与平台侧重",
        "国家差异点",
        "建议优先动作",
    ],
    "TOP10平台入口": [
        "国家",
        "国家销售额",
        "优先品线",
        "核心竞争品牌（国际/本土）",
        "核心竞品产品名称/型号",
        "国家判断",
        "平台类型",
        "平台",
        "入口/版块",
        "访问方式",
        "关键词包",
        "采样建议",
        "来源索引",
    ],
    "TOP10国家品线": [
        "国家",
        "产品品线",
        "销售额",
        "国家总销售额",
        "国家内占比",
        "品线排名",
        "抓取优先级",
    ],
    "信息源质量分层": [
        "国家",
        "区域cluster",
        "产品品线",
        "核心竞争品牌（国际/本土）",
        "核心竞品产品名称/型号",
        "品线优先级",
        "样本客群",
        "研究问题类型",
        "来源层级",
        "来源类型",
        "代表平台",
        "代表入口",
        "适配客群",
        "建议用途",
        "关键词方向",
        "来源获取方式",
        "风险说明",
    ],
    "P1搜索清单": [
        "国家",
        "产品品线",
        "核心竞争品牌（国际/本土）",
        "核心竞品产品名称/型号",
        "销售额",
        "国家总销售额",
        "国家内占比",
        "品线排名",
        "抓取优先级",
        "优先级说明",
        "核心产品词",
        "痛点词",
        "场景词",
        "决策词",
        "主题簇",
        "推荐入口",
        "站内搜索语句",
        "社区布尔组合",
        "决策搜索组合",
        "本地语言变体",
        "推荐Google搜索",
        "中英混合测试词",
        "入口1",
        "入口2",
        "入口3",
    ],
}


TARGET_PRODUCT_LINES = [
    "护理电器",
    "家居出行",
    "母婴综合护理",
    "内衣服饰",
    "喂养电器",
    "吸奶器",
    "智能母婴电器",
]

PRODUCT_LINE_COLORS = {
    "护理电器": "#3b82f6",
    "家居出行": "#10b981",
    "母婴综合护理": "#f59e0b",
    "内衣服饰": "#ec4899",
    "喂养电器": "#8b5cf6",
    "吸奶器": "#ef4444",
    "智能母婴电器": "#06b6d4",
}

CLUSTER_COLORS = {
    "北美": "#3b82f6",
    "英语成熟市场": "#10b981",
    "德语区": "#f59e0b",
    "法语区": "#ec4899",
    "西语区": "#8b5cf6",
    "海湾阿语区": "#06b6d4",
    "东南亚移动社媒区": "#f97316",
    "东亚高内容驱动区": "#ef4444",
    "南欧生活方式区": "#84cc16",
    "中东欧理性比较区": "#14b8a6",
    "西欧理性实用区": "#6366f1",
}

EXTRA_CLUSTER_PALETTE = [
    "#0ea5e9",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#f43f5e",
    "#14b8a6",
]

COUNTRY_EN = {
    "美国": "United States",
    "加拿大": "Canada",
    "英国": "United Kingdom",
    "德国": "Germany",
    "法国": "France",
    "西班牙": "Spain",
    "墨西哥": "Mexico",
    "阿联酋": "United Arab Emirates",
    "澳大利亚": "Australia",
    "沙特阿拉伯": "Saudi Arabia",
    "中国": "China",
    "意大利": "Italy",
    "马来西亚": "Malaysia",
    "奥地利": "Austria",
    "越南": "Vietnam",
    "波兰": "Poland",
    "菲律宾": "Philippines",
    "泰国": "Thailand",
    "荷兰": "Netherlands",
    "比利时": "Belgium",
}

COUNTRY_ISO = {
    "美国": "USA",
    "加拿大": "CAN",
    "英国": "GBR",
    "德国": "DEU",
    "法国": "FRA",
    "西班牙": "ESP",
    "墨西哥": "MEX",
    "阿联酋": "ARE",
    "澳大利亚": "AUS",
    "沙特阿拉伯": "SAU",
    "中国": "CHN",
    "意大利": "ITA",
    "马来西亚": "MYS",
    "奥地利": "AUT",
    "越南": "VNM",
    "波兰": "POL",
    "菲律宾": "PHL",
    "泰国": "THA",
    "荷兰": "NLD",
    "比利时": "BEL",
}


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    text = str(value).strip()
    return "" if text.lower() == "nan" else text


def split_lines(value: Any) -> list[str]:
    text = clean_text(value)
    if not text:
        return []
    parts = re.split(r"[\n\r]+", text)
    return [part.strip() for part in parts if part.strip() and part.strip() != "待补充"]


def split_cn_list(value: Any) -> list[str]:
    text = clean_text(value)
    if not text:
        return []
    normalized = text.replace("，", "、").replace(",", "、")
    return [item.strip() for item in normalized.split("、") if item.strip()]


def safe_number(value: Any) -> float:
    if value is None:
        return 0.0
    if isinstance(value, float) and math.isnan(value):
        return 0.0
    try:
        return float(value)
    except Exception:
        return 0.0


def normalize_priority(value: Any) -> str:
    text = clean_text(value).upper()
    match = re.search(r"P[0-2]", text)
    if match:
        return match.group(0)
    return "P2"


def normalize_platform_type(value: Any) -> str:
    text = clean_text(value)
    if "社媒" in text:
        return "社媒传播类"
    if "社区" in text:
        return "垂类社区类"
    if "官方" in text or "媒体" in text:
        return "垂类官方媒体类"
    return "社媒传播类"


def normalize_product_line(value: Any) -> str:
    text = clean_text(value)
    return text if text in TARGET_PRODUCT_LINES else text


def ensure_sheet_columns(sheet_name: str, df: pd.DataFrame) -> None:
    missing = [col for col in EXPECTED_COLUMNS[sheet_name] if col not in df.columns]
    if missing:
        raise ValueError(f"Sheet `{sheet_name}` 缺少必需列: {missing}")


def ts(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


def fallback_iso(country: str, idx: int) -> str:
    return COUNTRY_ISO.get(country, f"UNK{idx:03d}")


def parse_priority_product_lines(value: Any) -> list[dict[str, Any]]:
    lines = split_lines(value)
    result = []
    for line in lines:
        match = re.match(r"(.+?)（([\d.]+)）", line)
        if match:
            result.append({"name": match.group(1).strip(), "sales": round(float(match.group(2)))})
        else:
            result.append({"name": line, "sales": 0})
    return result


def build_project_overview(df: pd.DataFrame) -> dict[str, Any]:
    mapping = {clean_text(row["项目"]): row["数值"] for _, row in df.iterrows()}
    return {
        "rawDataRows": int(safe_number(mapping.get("原始国家×品线行数"))),
        "validAnalysisRows": int(safe_number(mapping.get("有效分析行数"))),
        "excludedProductLines": split_cn_list(mapping.get("排除品线")),
        "top20CountriesCount": int(safe_number(mapping.get("TOP20国家数"))),
        "top10CountriesCount": int(safe_number(mapping.get("TOP10国家数"))),
        "top10TargetCombinations": int(safe_number(mapping.get("TOP10目标国家×品线组合数"))),
        "p1Combinations": int(safe_number(mapping.get("P1组合数"))),
    }


def build_top20(df: pd.DataFrame, country_cluster: dict[str, str]) -> list[dict[str, Any]]:
    rows = df.sort_values("销售额", ascending=False).reset_index(drop=True)
    result = []
    for idx, (_, row) in enumerate(rows.iterrows(), start=1):
        country = clean_text(row["国家"])
        result.append(
            {
                "rank": idx,
                "country": country,
                "countryEn": COUNTRY_EN.get(country, country),
                "sales": safe_number(row["销售额"]),
                "insight": clean_text(row["国家洞察"]),
                "regionCluster": country_cluster.get(country, "待补充"),
            }
        )
    return result


def build_country_profiles(df: pd.DataFrame) -> list[dict[str, Any]]:
    profiles = []
    for _, row in df.iterrows():
        product_line = normalize_product_line(row["产品品线"])
        if product_line not in TARGET_PRODUCT_LINES:
            continue
        profiles.append(
            {
                "country": clean_text(row["国家"]),
                "productLine": product_line,
                "persona": clean_text(row["身份画像"]),
                "mediaPreference": clean_text(row["媒体偏好"]),
                "purchaseHabit": clean_text(row["购买习惯"]),
                "brandPreference": clean_text(row["品牌偏好"]),
                "coreCompetitors": clean_text(row["核心竞争品牌（国际/本土）"]),
                "competitorProducts": clean_text(row["核心竞品产品名称/型号"]),
                "marketingPreference": clean_text(row["营销偏好"]),
                "socialPlatforms": split_lines(row["社媒传播类平台"]),
                "communityPlatforms": split_lines(row["垂类社区平台"]),
                "officialPlatforms": split_lines(row["垂类官方媒体平台"]),
            }
        )
    return profiles


def build_customer_segments(df: pd.DataFrame) -> list[dict[str, Any]]:
    segments = []
    for _, row in df.iterrows():
        product_line = normalize_product_line(row["产品品线"])
        if product_line not in TARGET_PRODUCT_LINES:
            continue
        segments.append(
            {
                "country": clean_text(row["国家"]),
                "regionCluster": clean_text(row["区域cluster"]),
                "purchasingPower": clean_text(row["国家购买力初判"]),
                "productLine": product_line,
                "coreCompetitors": clean_text(row["核心竞争品牌（国际/本土）"]),
                "competitorProducts": clean_text(row["核心竞品产品名称/型号"]),
                "priority": normalize_priority(row["品线优先级"]),
                "segmentCode": clean_text(row["客群编码"]),
                "segmentName": clean_text(row["客群名称"]),
                "lifecycle": clean_text(row["生命周期"]),
                "corePainPoints": clean_text(row["核心痛点"]),
                "mainBarriers": clean_text(row["主要阻力"]),
                "coreTrustSources": clean_text(row["核心信任来源"]),
                "priorityContentAngles": clean_text(row["优先内容切口"]),
                "priceSensitivity": clean_text(row["价格敏感初判"]),
                "localMarketingAngles": clean_text(row["本地化营销切口"]),
                "socialPlatforms": split_lines(row["社媒传播类平台"]),
                "communityPlatforms": split_lines(row["垂类社区平台"]),
                "officialPlatforms": split_lines(row["垂类官方媒体平台"]),
                "countryJudgment": clean_text(row["国家本地判断"]),
                "sourceIndex": clean_text(row["来源索引"]),
            }
        )
    return segments


def build_region_clusters(df: pd.DataFrame) -> list[dict[str, Any]]:
    return [
        {
            "name": clean_text(row["区域cluster"]),
            "top20Representatives": split_cn_list(row["TOP20代表国家"]),
            "top20Count": int(safe_number(row["TOP20国家数"])),
            "customerCharacteristics": clean_text(row["共性客群特征"]),
            "trustSources": clean_text(row["共性信任来源"]),
            "contentAngles": clean_text(row["共性内容切口"]),
            "priceStrategy": clean_text(row["共性价格策略"]),
            "channelFocus": clean_text(row["渠道与平台侧重"]),
            "countryDifferences": clean_text(row["国家差异点"]),
            "priorityActions": clean_text(row["建议优先动作"]),
        }
        for _, row in df.iterrows()
    ]


def build_cluster_colors(region_clusters: list[dict[str, Any]]) -> dict[str, str]:
    colors = dict(CLUSTER_COLORS)
    extra_idx = 0
    for cluster in region_clusters:
        name = cluster["name"]
        if name not in colors:
            colors[name] = EXTRA_CLUSTER_PALETTE[extra_idx % len(EXTRA_CLUSTER_PALETTE)]
            extra_idx += 1
    return colors


def build_platform_entries(df: pd.DataFrame) -> list[dict[str, Any]]:
    entries = []
    for _, row in df.iterrows():
        entries.append(
            {
                "country": clean_text(row["国家"]),
                "sales": round(safe_number(row["国家销售额"])),
                "priorityProductLines": parse_priority_product_lines(row["优先品线"]),
                "coreCompetitors": clean_text(row["核心竞争品牌（国际/本土）"]),
                "competitorProducts": clean_text(row["核心竞品产品名称/型号"]),
                "countryJudgment": clean_text(row["国家判断"]),
                "platformType": normalize_platform_type(row["平台类型"]),
                "platform": clean_text(row["平台"]),
                "entryPoints": split_lines(row["入口/版块"]),
                "accessMethod": clean_text(row["访问方式"]),
                "keywordPackage": clean_text(row["关键词包"]),
                "samplingSuggestion": clean_text(row["采样建议"]),
                "sourceIndex": clean_text(row["来源索引"]),
            }
        )
    return entries


def build_info_source_tiers(df: pd.DataFrame) -> list[dict[str, Any]]:
    rows = []
    for _, row in df.iterrows():
        product_line = normalize_product_line(row["产品品线"])
        if product_line not in TARGET_PRODUCT_LINES:
            continue
        rows.append(
            {
                "country": clean_text(row["国家"]),
                "regionCluster": clean_text(row["区域cluster"]),
                "productLine": product_line,
                "coreCompetitors": clean_text(row["核心竞争品牌（国际/本土）"]),
                "competitorProducts": clean_text(row["核心竞品产品名称/型号"]),
                "priority": normalize_priority(row["品线优先级"]),
                "sampleSegment": clean_text(row["样本客群"]),
                "researchQuestionType": clean_text(row["研究问题类型"]),
                "sourceTier": clean_text(row["来源层级"]),
                "sourceType": clean_text(row["来源类型"]),
                "representativePlatform": clean_text(row["代表平台"]),
                "representativeEntry": clean_text(row["代表入口"]),
                "fitSegments": clean_text(row["适配客群"]),
                "suggestedUsage": clean_text(row["建议用途"]),
                "keywordDirection": clean_text(row["关键词方向"]),
                "acquisitionMethod": clean_text(row["来源获取方式"]),
                "riskDescription": clean_text(row["风险说明"]),
            }
        )
    return rows


def build_p1_search_items(df: pd.DataFrame) -> list[dict[str, Any]]:
    rows = []
    for _, row in df.iterrows():
        product_line = normalize_product_line(row["产品品线"])
        if product_line not in TARGET_PRODUCT_LINES:
            continue
        rows.append(
            {
                "country": clean_text(row["国家"]),
                "productLine": product_line,
                "coreCompetitors": clean_text(row["核心竞争品牌（国际/本土）"]),
                "competitorProducts": clean_text(row["核心竞品产品名称/型号"]),
                "sales": round(safe_number(row["销售额"])),
                "countryTotalSales": round(safe_number(row["国家总销售额"])),
                "countryShare": safe_number(row["国家内占比"]),
                "productRank": int(safe_number(row["品线排名"])),
                "priority": normalize_priority(row["抓取优先级"]),
                "priorityExplanation": clean_text(row["优先级说明"]),
                "coreProductTerms": clean_text(row["核心产品词"]),
                "painPointTerms": clean_text(row["痛点词"]),
                "scenarioTerms": clean_text(row["场景词"]),
                "decisionTerms": clean_text(row["决策词"]),
                "topicClusters": clean_text(row["主题簇"]),
                "recommendedEntries": clean_text(row["推荐入口"]),
                "siteSearchQuery": clean_text(row["站内搜索语句"]),
                "communityBooleanQuery": clean_text(row["社区布尔组合"]),
                "decisionSearchQuery": clean_text(row["决策搜索组合"]),
                "localLanguageVariants": clean_text(row["本地语言变体"]),
                "recommendedGoogleSearch": clean_text(row["推荐Google搜索"]),
                "mixedLanguageTestTerms": clean_text(row["中英混合测试词"]),
                "entry1": clean_text(row["入口1"]),
                "entry2": clean_text(row["入口2"]),
                "entry3": clean_text(row["入口3"]),
            }
        )
    return rows


def build_product_line_sales(df: pd.DataFrame) -> dict[str, dict[str, int]]:
    result: dict[str, dict[str, int]] = {}
    for _, row in df.iterrows():
        country = clean_text(row["国家"])
        product_line = normalize_product_line(row["产品品线"])
        if product_line not in TARGET_PRODUCT_LINES:
            continue
        result.setdefault(country, {pl: 0 for pl in TARGET_PRODUCT_LINES})
        result[country][product_line] = round(safe_number(row["销售额"]))
    return result


def build_top_country_product_lines(df: pd.DataFrame) -> list[dict[str, Any]]:
    rows = []
    for _, row in df.iterrows():
        product_line = normalize_product_line(row["产品品线"])
        if product_line not in TARGET_PRODUCT_LINES:
            continue
        rows.append(
            {
                "country": clean_text(row["国家"]),
                "productLine": product_line,
                "sales": round(safe_number(row["销售额"])),
                "countryTotalSales": round(safe_number(row["国家总销售额"])),
                "countryShare": safe_number(row["国家内占比"]),
                "productRank": int(safe_number(row["品线排名"])),
                "priority": normalize_priority(row["抓取优先级"]),
            }
        )
    return rows


def build_country_cluster_lookup(segments_df: pd.DataFrame, clusters_df: pd.DataFrame) -> dict[str, str]:
    lookup: dict[str, str] = {}
    for _, row in segments_df.iterrows():
        country = clean_text(row["国家"])
        cluster = clean_text(row["区域cluster"])
        if country and cluster and country not in lookup:
            lookup[country] = cluster
    valid_clusters = {clean_text(row["区域cluster"]) for _, row in clusters_df.iterrows()}
    return {country: cluster for country, cluster in lookup.items() if cluster in valid_clusters}


def build_map_country_data(
    countries: list[str],
    country_profiles: list[dict[str, Any]],
    country_cluster: dict[str, str],
    top20_lookup: dict[str, float],
) -> list[dict[str, Any]]:
    profile_lines: dict[str, set[str]] = {}
    for profile in country_profiles:
        profile_lines.setdefault(profile["country"], set()).add(profile["productLine"])

    result = []
    for idx, country in enumerate(countries, start=1):
        result.append(
            {
                "country": country,
                "isoCode": fallback_iso(country, idx),
                "sales": round(top20_lookup.get(country, 0)),
                "cluster": country_cluster.get(country, "待补充"),
                "productLines": sorted(profile_lines.get(country, set())),
            }
        )
    return result


def main() -> None:
    excel_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_EXCEL
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_OUTPUT

    workbook = pd.ExcelFile(excel_path)
    for sheet_name in EXPECTED_COLUMNS:
        if sheet_name not in workbook.sheet_names:
            raise ValueError(f"工作簿缺少必需 Sheet: {sheet_name}")

    sheets = {name: pd.read_excel(excel_path, sheet_name=name) for name in EXPECTED_COLUMNS}
    for sheet_name, df in sheets.items():
        ensure_sheet_columns(sheet_name, df)

    project_overview = build_project_overview(sheets["项目总览"])
    country_cluster = build_country_cluster_lookup(sheets["国家×品线×客群矩阵"], sheets["区域cluster策略卡"])
    top20_countries = build_top20(sheets["TOP20国家深挖"], country_cluster)
    country_profiles = build_country_profiles(sheets["全量国家品线画像"])
    customer_segments = build_customer_segments(sheets["国家×品线×客群矩阵"])
    region_clusters = build_region_clusters(sheets["区域cluster策略卡"])
    cluster_colors = build_cluster_colors(region_clusters)
    platform_entries = build_platform_entries(sheets["TOP10平台入口"])
    info_source_tiers = build_info_source_tiers(sheets["信息源质量分层"])
    p1_search_items = build_p1_search_items(sheets["P1搜索清单"])
    top_country_product_lines = build_top_country_product_lines(sheets["TOP10国家品线"])
    product_line_sales_by_country = build_product_line_sales(sheets["TOP10国家品线"])

    all_countries = sorted({profile["country"] for profile in country_profiles})
    top20_lookup = {item["country"]: item["sales"] for item in top20_countries}
    map_country_data = build_map_country_data(all_countries, country_profiles, country_cluster, top20_lookup)

    unique_clusters = sorted({item["regionCluster"] for item in top20_countries})
    if len(top20_countries) != project_overview["top20CountriesCount"]:
        raise ValueError("TOP20 国家数量与项目总览不一致")
    if len(region_clusters) < len(unique_clusters):
        raise ValueError("区域 cluster 策略卡数量少于 TOP20 中出现的 cluster 数")
    if any(item["priority"] not in {"P0", "P1", "P2"} for item in customer_segments):
        raise ValueError("customerSegments 中存在非法 priority")
    if any(item["platformType"] not in {"社媒传播类", "垂类社区类", "垂类官方媒体类"} for item in platform_entries):
        raise ValueError("platformEntries 中存在非法 platformType")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    source_note = "专题2：VOC_目的国VOC舆情分析_业务评审版.xlsx"
    generated_dir = output_path.parent / "generated"
    generated_dir.mkdir(parents=True, exist_ok=True)

    overview_module = f"""// 自动生成于 {timestamp}
// 来源：{source_note}

import type {{
  ProjectOverview,
  Top20Country,
  RegionCluster,
  NavItem,
}} from '../../types';

export const projectOverview: ProjectOverview = {ts(project_overview)};

export const top20Countries: Top20Country[] = {ts(top20_countries)};

export const regionClusters: RegionCluster[] = {ts(region_clusters)};

export const navItems: NavItem[] = [
  {{ id: 'overview', label: '项目总览', icon: 'LayoutDashboard' }},
  {{ id: 'top20', label: 'TOP20国家', icon: 'Trophy' }},
  {{ id: 'countries', label: '国家画像', icon: 'Globe' }},
  {{ id: 'products', label: '品线分析', icon: 'Package' }},
  {{ id: 'segments', label: '客群矩阵', icon: 'Users' }},
  {{ id: 'clusters', label: '区域策略', icon: 'Map' }},
  {{ id: 'platforms', label: '平台入口', icon: 'Share2' }},
  {{ id: 'infoSources', label: '信息源质量分层', icon: 'ShieldCheck' }},
  {{ id: 'p1Search', label: 'P1搜索清单', icon: 'Search' }},
];
"""

    country_module = f"""// 自动生成于 {timestamp}
// 来源：{source_note}

import type {{
  CountryProductProfile,
  MapCountryData,
}} from '../../types';

export const countryProductProfiles: CountryProductProfile[] = {ts(country_profiles)};

export const clusterColors: Record<string, string> = {ts(cluster_colors)};

export const allCountries: string[] = {ts(all_countries)};

export const mapCountryData: MapCountryData[] = {ts(map_country_data)};
"""

    product_module = f"""// 自动生成于 {timestamp}
// 来源：{source_note}

import type {{
  ProductLine,
  TopCountryProductLine,
}} from '../../types';

export const productLines: ProductLine[] = {ts(TARGET_PRODUCT_LINES)};

export const productLineColors: Record<ProductLine, string> = {ts(PRODUCT_LINE_COLORS)};

export const topCountryProductLines: TopCountryProductLine[] = {ts(top_country_product_lines)};

export const productLineSalesByCountry: Record<string, Record<ProductLine, number>> = {ts(product_line_sales_by_country)};
"""

    segment_module = f"""// 自动生成于 {timestamp}
// 来源：{source_note}

import type {{
  CustomerSegment,
}} from '../../types';

export const customerSegments: CustomerSegment[] = {ts(customer_segments)};
"""

    platform_module = f"""// 自动生成于 {timestamp}
// 来源：{source_note}

import type {{
  PlatformEntry,
  InfoSourceTier,
  P1SearchItem,
}} from '../../types';

export const platformEntries: PlatformEntry[] = {ts(platform_entries)};

export const infoSourceTiers: InfoSourceTier[] = {ts(info_source_tiers)};

export const p1SearchItems: P1SearchItem[] = {ts(p1_search_items)};
"""

    barrel_module = """// VOC目的国舆情分析 - 数据入口
// 该文件由脚本自动生成，请勿手动编辑

export * from './generated/overview.generated';
export * from './generated/country.generated';
export * from './generated/product.generated';
export * from './generated/segment.generated';
export * from './generated/platform.generated';
"""

    (generated_dir / "overview.generated.ts").write_text(overview_module, encoding="utf-8")
    (generated_dir / "country.generated.ts").write_text(country_module, encoding="utf-8")
    (generated_dir / "product.generated.ts").write_text(product_module, encoding="utf-8")
    (generated_dir / "segment.generated.ts").write_text(segment_module, encoding="utf-8")
    (generated_dir / "platform.generated.ts").write_text(platform_module, encoding="utf-8")
    output_path.write_text(barrel_module, encoding="utf-8")
    print(f"Generated {output_path}")
    print(f"top20Countries={len(top20_countries)} regionClusters={len(region_clusters)} customerSegments={len(customer_segments)}")


if __name__ == "__main__":
    main()
