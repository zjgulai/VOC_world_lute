const DEFAULT_STOP_TERMS = new Set([
  '待补充',
  '暂无',
  '其他',
  '说明',
  '表达',
  '支持型表达',
  '优先支持型表达',
  '优先办公场景与长期使用对比表达',
  '优先支持型表达与医院返岗场景说明',
  '分层客群不混卖',
  '真实妈妈前后对比',
  '直播限时优惠',
  '短视频教程',
  '高端礼盒',
  '多语安心',
]);

const TERM_ALIASES: Record<string, string> = {
  长测评: '长评测',
  长期长评: '长评测',
  长评: '长评测',
  真实经验: '妈妈经验',
  同阶段妈妈真实经验: '妈妈经验',
  返岗妈妈经验帖: '返岗经验',
  专家科普: '专家科普',
  办公室场景: '办公场景',
  第一次使用教程: '新手教程',
  第一次使用: '新手使用',
  疼痛缓解: '缓解疼痛',
  续航能力: '续航',
  配件不便携: '配件便携',
  替换件兼容性差: '配件兼容性',
  后续耗材贵: '耗材成本',
  耗材成本高: '耗材成本',
  噪音明显: '噪音',
};

function normalizeToken(raw: string) {
  return raw
    .replace(/[【】「」"'`]/g, '')
    .replace(/[()（）]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[·•]/g, '')
    .trim();
}

function shouldDropToken(token: string) {
  if (!token) return true;
  if (DEFAULT_STOP_TERMS.has(token)) return true;
  if (token.length <= 1) return true;
  if (token.length >= 18) return true;
  if (token.includes('——')) return true;
  if (token.includes('审核')) return true;
  if (token.includes('优先') && token.includes('说明')) return true;
  if (token.includes('讲品质') || token.includes('讲促销')) return true;
  return false;
}

export function extractInsightTerms(value: string) {
  return value
    .split(/[、,，/+|;；\n]+/)
    .map((item) => normalizeToken(item))
    .map((item) => TERM_ALIASES[item] ?? item)
    .filter((item) => !shouldDropToken(item));
}

export function formatInsightSources(values: string[], limit = 3) {
  return Array.from(new Set(values.filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .slice(0, limit)
    .join(' / ');
}
