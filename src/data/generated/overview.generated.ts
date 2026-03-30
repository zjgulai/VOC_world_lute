// 自动生成于 2026-03-30 16:49:36
// 来源：专题2：VOC_目的国VOC舆情分析_业务评审版.xlsx

import type {
  ProjectOverview,
  Top20Country,
  RegionCluster,
  NavItem,
} from '../../types';

export const projectOverview: ProjectOverview = {
  "rawDataRows": 197,
  "validAnalysisRows": 175,
  "excludedProductLines": [
    "BBM PDT",
    "Comfelie产品部",
    "母婴电器创新"
  ],
  "top20CountriesCount": 20,
  "top10CountriesCount": 10,
  "top10TargetCombinations": 29,
  "p1Combinations": 16
};

export const top20Countries: Top20Country[] = [
  {
    "rank": 1,
    "country": "美国",
    "countryEn": "United States",
    "sales": 469810.8351363502,
    "insight": "美国母婴消费高度平台化，妈妈群体会在社媒种草、论坛求助和专家站点之间反复验证，再进入电商或品牌官网成交。",
    "regionCluster": "北美"
  },
  {
    "rank": 2,
    "country": "加拿大",
    "countryEn": "Canada",
    "sales": 32783.14871717,
    "insight": "加拿大同时存在英语与法语内容消费路径，妈妈更偏好‘真实经验 + 权威建议’并行，尤其重视育儿阶段内容与本地家庭语境。",
    "regionCluster": "北美"
  },
  {
    "rank": 3,
    "country": "英国",
    "countryEn": "United Kingdom",
    "sales": 31773.47871356,
    "insight": "英国妈妈高度依赖论坛式讨论文化，对‘别的妈妈怎么说’非常敏感；决策常从论坛问题串延伸到社媒短内容和官方健康建议。",
    "regionCluster": "英语成熟市场"
  },
  {
    "rank": 4,
    "country": "德国",
    "countryEn": "Germany",
    "sales": 22529.4388034,
    "insight": "德国妈妈决策理性，重视功能细节、专家论坛和深度对比；论坛与专业育儿站在选购链路中权重很高。",
    "regionCluster": "德语区"
  },
  {
    "rank": 5,
    "country": "法国",
    "countryEn": "France",
    "sales": 19125.47107507001,
    "insight": "法国市场对编辑部内容和论坛并行消费，妈妈用户偏好兼具专业感与生活感的母婴内容，且对实用建议与讨论氛围都很看重。",
    "regionCluster": "法语区"
  },
  {
    "rank": 6,
    "country": "西班牙",
    "countryEn": "Spain",
    "sales": 8673.17052959,
    "insight": "西班牙妈妈偏好家庭导向、可执行的育儿内容，图文和短视频结合的内容更容易完成从认知到转化的闭环。",
    "regionCluster": "西语区"
  },
  {
    "rank": 7,
    "country": "墨西哥",
    "countryEn": "Mexico",
    "sales": 8404.23298274999,
    "insight": "墨西哥母婴用户对社媒与妈妈群口碑依赖度很高，优惠触达、真实经验和阶段性育儿内容对转化影响明显。",
    "regionCluster": "西语区"
  },
  {
    "rank": 8,
    "country": "阿联酋",
    "countryEn": "United Arab Emirates",
    "sales": 5386.32979506,
    "insight": "阿联酋母婴人群高度活跃于视觉化社媒，阿语与英语内容并行；跨国家庭、外籍妈妈群和权威母婴站点共同影响决策。",
    "regionCluster": "海湾阿语区"
  },
  {
    "rank": 9,
    "country": "澳大利亚",
    "countryEn": "Australia",
    "sales": 5052.41611321,
    "insight": "澳大利亚妈妈更偏好实用型、生活场景型内容，常在社区和官方育儿资源之间交叉验证，尤其关注‘真实可执行’。",
    "regionCluster": "英语成熟市场"
  },
  {
    "rank": 10,
    "country": "沙特阿拉伯",
    "countryEn": "Saudi Arabia",
    "sales": 4911.9353145,
    "insight": "沙特母婴用户与阿联酋相似，同样偏好视觉化社媒和阿语内容站，且更看重家庭口碑与社交互动带来的信任累积。",
    "regionCluster": "海湾阿语区"
  },
  {
    "rank": 11,
    "country": "中国",
    "countryEn": "China",
    "sales": 4398.35814207994,
    "insight": "中国母婴用户决策路径高度内容驱动，常见链路是小红书种草 -> 抖音/短视频验证 -> 妈妈群或评论区确认 -> 平台成交。",
    "regionCluster": "东亚高内容驱动区"
  },
  {
    "rank": 12,
    "country": "意大利",
    "countryEn": "Italy",
    "sales": 4095.74731487,
    "insight": "意大利妈妈更关注舒适体验和家庭日常场景，内容消费偏温和但重信任，对‘真实生活方式内容’反应更好。",
    "regionCluster": "南欧生活方式区"
  },
  {
    "rank": 13,
    "country": "马来西亚",
    "countryEn": "Malaysia",
    "sales": 3420.329487889994,
    "insight": "马来西亚妈妈对社媒短内容和真实故事内容接受度高，英语与本地语言内容并行，品牌需要兼顾专业感与亲和力。",
    "regionCluster": "东南亚移动社媒区"
  },
  {
    "rank": 14,
    "country": "奥地利",
    "countryEn": "Austria",
    "sales": 3000.69071889,
    "insight": "奥地利与德国共享大量德语育儿内容生态，妈妈在选品上同样偏好专家答疑、论坛深聊和细节型测评。",
    "regionCluster": "德语区"
  },
  {
    "rank": 15,
    "country": "越南",
    "countryEn": "Vietnam",
    "sales": 2426.92256717,
    "insight": "越南妈妈非常依赖移动端和社媒，短视频种草、妈妈群口碑和本地化育儿内容共同驱动购买。",
    "regionCluster": "东南亚移动社媒区"
  },
  {
    "rank": 16,
    "country": "波兰",
    "countryEn": "Poland",
    "sales": 2409.1541379,
    "insight": "波兰妈妈在本地家长媒体与全球母婴平台之间切换较多，既看内容可信度，也依赖社群与长评做最终确认。",
    "regionCluster": "中东欧理性比较区"
  },
  {
    "rank": 17,
    "country": "菲律宾",
    "countryEn": "Philippines",
    "sales": 2160.16767495,
    "insight": "菲律宾妈妈对社媒和社区互动依赖很强，内容偏好‘经验分享 + 明确建议’，Facebook生态影响尤为显著。",
    "regionCluster": "东南亚移动社媒区"
  },
  {
    "rank": 18,
    "country": "泰国",
    "countryEn": "Thailand",
    "sales": 1833.13757721,
    "insight": "泰国妈妈更偏好‘轻知识 + 强场景’内容，KOL内容和本地亲子媒体对品牌认知与口碑建设都很关键。",
    "regionCluster": "东南亚移动社媒区"
  },
  {
    "rank": 19,
    "country": "荷兰",
    "countryEn": "Netherlands",
    "sales": 1423.33185344,
    "insight": "荷兰家庭决策理性，偏好简洁可信、实用导向的育儿信息，论坛与专业媒体的组合更适合长期影响。",
    "regionCluster": "西欧理性实用区"
  },
  {
    "rank": 20,
    "country": "比利时",
    "countryEn": "Belgium",
    "sales": 1235.72131924,
    "insight": "比利时母婴内容消费受法语区媒体影响较大，妈妈用户会在论坛讨论和编辑部内容之间来回验证。",
    "regionCluster": "法语区"
  }
];

export const regionClusters: RegionCluster[] = [
  {
    "name": "北美",
    "top20Representatives": [
      "加拿大",
      "美国"
    ],
    "top20Count": 2,
    "customerCharacteristics": "家庭决策链长、重视安全与保险/退换、愿意为「省时+专业」付溢价；妈妈社群与长评文化强。",
    "trustSources": "儿科/泌乳顾问背书、FDA/安全认证、Amazon 长评与问答、妈妈 Facebook 群与 Reddit。",
    "contentAngles": "「真实场景减负」「泵奶效率与舒适度」「背奶返岗」「保险/退换安心」。",
    "priceStrategy": "中高价分层 + 套装/耗材绑定 + 会员复购；大促以 bundle 与赠品为主，避免纯低价叙事。",
    "channelFocus": "Amazon 成交主阵地 + 品牌站承接教育；社媒以短视频/真实测评导流。",
    "countryDifferences": "美国：竞品多、需强专业背书与长评；加拿大：英法双语路径与本地信任媒体并行。",
    "priorityActions": "① 建立可检索的长评与 Q&A 运营节奏；② 套装与耗材 SKU 规划；③ 北美合规与安全话术资产库。"
  },
  {
    "name": "英语成熟市场",
    "top20Representatives": [
      "澳大利亚",
      "英国"
    ],
    "top20Count": 2,
    "customerCharacteristics": "论坛与独立评测文化成熟，购买前「社区验证」权重大；重视可持续与品牌透明度。",
    "trustSources": "母婴论坛热帖、独立测评站、YouTube 深度评测、NHS/公立体系相关科普（英国语境）。",
    "contentAngles": "「论坛可验证的真实口碑」「对比表与长期使用成本」「公立体系下的喂养痛点」。",
    "priceStrategy": "中高价可行，但需先建立论坛/评测口碑；促销配合 FAQ 与套装，不宜裸价冲量。",
    "channelFocus": "Amazon + 品牌站；英国侧重论坛与比价；澳洲侧重本地妈妈社区与实用耐用叙事。",
    "countryDifferences": "英国：Mumsnet 等论坛权重高；澳洲：户外/背奶与耐用场景更突出；爱尔兰：HSE 官方与 RollerCoaster / Boards 论坛双验证更强，返岗权益、closed system 与价格分层需讲清。",
    "priorityActions": "① 论坛种子帖与 KOL 长期合作；② 对比页与 TCO（总拥有成本）内容；③ 英国/澳洲分素材测试；④ 以爱尔兰作为英语成熟市场首个已补证扩国家样本，验证并入口径。"
  },
  {
    "name": "德语区",
    "top20Representatives": [
      "奥地利",
      "德国"
    ],
    "top20Count": 2,
    "customerCharacteristics": "参数与规范敏感、信任「标准+测试」叙事；促销过多易损品牌专业感。",
    "trustSources": "Stiftung Warentest 等测评、儿科/助产士内容、专业母婴媒体评测。",
    "contentAngles": "「测试与标准」「耐用与可维修」「清晰技术规格与使用边界」。",
    "priceStrategy": "中高价 + 清晰产品线分层；弱折扣、强对比与规格说明；套装偏理性组合。",
    "channelFocus": "Amazon.de + 专业媒体评测导流；官网做规格与下载中心。",
    "countryDifferences": "奥地利体量较小，可与德国共用素材但注意本地语言与价格展示习惯；瑞士：`swissmom` 与 `Babyforum.ch` 权重更高，医保/药房租赁与返岗泵奶权益会直接影响定价和内容表达。",
    "priorityActions": "① 德语规格表与测评素材包；② 送测与媒体名单；③ 避免过度促销话术；④ 以瑞士作为德语区首个已补证扩国家样本，验证并入口径。"
  },
  {
    "name": "法语区",
    "top20Representatives": [
      "比利时",
      "法国"
    ],
    "top20Count": 2,
    "customerCharacteristics": "兼顾生活方式与专业感；编辑部内容与品牌感并重；节日与家庭场景促销响应好。",
    "trustSources": "母婴杂志/网站编辑部、儿科与助产士、Instagram 生活方式母婴博主。",
    "contentAngles": "「品质生活 + 实用」「节日礼盒与家庭仪式感」「专业但不过度冷冰冰」。",
    "priceStrategy": "中高价分层；组合购、内容种草、节点促销并行。",
    "channelFocus": "Amazon.fr + 法媒种草；比利时注意荷法双语区域差异。",
    "countryDifferences": "比利时：荷语区与法语区素材与落地页宜分轨。",
    "priorityActions": "① 法文生活方式素材库；② 节日营销日历；③ 荷法双语测试计划。"
  },
  {
    "name": "西语区",
    "top20Representatives": [
      "墨西哥",
      "西班牙"
    ],
    "top20Count": 2,
    "customerCharacteristics": "家庭场景与性价比敏感并重；西语内容种草与节点促销转化强；墨西哥比西班牙更价格敏感。",
    "trustSources": "Facebook/Instagram 妈妈博主、本土电商评价、药房/连锁（因国而异）。",
    "contentAngles": "「家庭套装」「明确优惠与满减」「看得懂的对比与教程」。",
    "priceStrategy": "西班牙：中价带+入门/升级款分层；墨西哥：中低到中价+首单礼、套装、节点优惠。",
    "channelFocus": "Amazon + Mercado Libre（墨西哥）+ 短视频/直播承接。",
    "countryDifferences": "智利返岗与冷链准备语境更强，法兰尺寸适配与频率分层对吸奶器决策影响更大，不宜只沿用墨西哥式优惠叙事。",
    "priorityActions": "① 用智利验证‘返岗前准备 + 尺寸适配’路径；② 西语教程与价格分层同时保留；③ 后续再对拉美西语区做更细分拆。"
  },
  {
    "name": "海湾阿语区",
    "top20Representatives": [
      "沙特阿拉伯",
      "阿联酋"
    ],
    "top20Count": 2,
    "customerCharacteristics": "高收入与价格敏感群体并存；多语（阿/英）内容；礼品与高端场景需求强。",
    "trustSources": "国际品牌心智、私立医疗与育儿 KOL、Instagram/TikTok 高端母婴内容。",
    "contentAngles": "「高端礼盒」「多语安心」「分层客群不混卖——高端讲品质、敏感群体讲促销」。",
    "priceStrategy": "高端与中价并行；高端礼盒 + 节点礼包；避免单一价格带打天下。",
    "channelFocus": "Amazon.ae + noon + 社媒；沙特注意本地规范与节庆营销。",
    "countryDifferences": "海湾市场并非单一高端。科威特已出现中价双边电动与高端免提并存，本地 support group 与 bilingual support 对持续泵奶决策更重要。",
    "priorityActions": "① 补阿语/英语双语 FAQ；② 高端安心线与中价效率线双落地页；③ 以科威特作为海湾阿语区首个已补证扩国家样本。"
  },
  {
    "name": "东南亚移动社媒区",
    "top20Representatives": [
      "泰国",
      "菲律宾",
      "越南",
      "马来西亚"
    ],
    "top20Count": 4,
    "customerCharacteristics": "移动端-first、短视频与直播渗透高；价格敏感与促销活跃；各国语言与支付方式差异大。",
    "trustSources": "Facebook 妈妈群、Shopee/Lazada 评价、TikTok/短视频达人、本地母婴 KOL。",
    "contentAngles": "「短视频教程」「直播限时优惠」「真实妈妈前后对比」。",
    "priceStrategy": "中低到中价为主；直播券、店铺券、套装；强调「到手价」与赠品。",
    "channelFocus": "Shopee/Lazada/TikTok Shop（因国而异）；各国分账号运营。",
    "countryDifferences": "新加坡比泛东南亚更重官方功能说明、主流零售价格带和空间友好体验，不应只按直播促销逻辑处理。",
    "priorityActions": "① 以新加坡验证“功能分层 + 教程化表达”路径；② 补 baby fair / office pantry 场景；③ 保留与其他东南亚市场不同的官方零售口径。"
  },
  {
    "name": "东亚高内容驱动区",
    "top20Representatives": [
      "中国"
    ],
    "top20Count": 1,
    "customerCharacteristics": "内容电商与站内种草极重要；信任「测评+对比+榜单」；决策链路短但比选激烈。",
    "trustSources": "小红书/抖音/B 站、知乎与垂直母婴号、电商站内评价与问答。",
    "contentAngles": "「横评与榜单」「场景化痛点」「国货/进口对比中的差异化卖点」。",
    "priceStrategy": "分层明显；大促节点密集；套装与赠品心智强，需控价与价盘管理。",
    "channelFocus": "天猫/京东等 + 内容平台闭环；注意合规表述与广告法。",
    "countryDifferences": "中国仍是该 cluster 的 TOP20 基准国；日本进一步证明该区并非只有内容电商闭环，还要把助产师监修、匿名问答、价格比较、官方商品页与租赁路径一起纳入。",
    "priorityActions": "① 保留中国的榜单/横评框架；② 引入日本的助产师监修、Yahoo!知恵袋与官方租赁解释；③ 以日本作为该 cluster 首个已正式并入的长尾国家样本。"
  },
  {
    "name": "南欧生活方式区",
    "top20Representatives": [
      "意大利"
    ],
    "top20Count": 1,
    "customerCharacteristics": "重视家庭与情感表达、生活方式视觉；购买决策受亲友与门店/药房场景影响（因品类而异）。",
    "trustSources": "Instagram 生活方式博主、母婴垂直媒体、线下药房/连锁（视品类准入）。",
    "contentAngles": "「意式家庭场景」「情感化但不过度煽情」「设计与实用平衡」。",
    "priceStrategy": "中价带为主，搭配节日促销；强调「值得拥有的升级」。",
    "channelFocus": "Amazon.it + 社媒种草；线下如可布局需单独评估品类准入。",
    "countryDifferences": "意大利单国代表，需与西语区素材区分，避免文化混用。",
    "priorityActions": "① 意语生活方式素材；② 与西语素材的明确区隔；③ 节日与家庭主题排期。"
  },
  {
    "name": "中东欧理性比较区",
    "top20Representatives": [
      "波兰"
    ],
    "top20Count": 1,
    "customerCharacteristics": "性价比与参数对比敏感；促销节点响应明显；信任「可验证的评价与规格」。",
    "trustSources": "本土电商评价、Facebook 妈妈群、比价与促销信息账号。",
    "contentAngles": "「清晰对比表」「促销倒计时」「真实开箱与长期使用」。",
    "priceStrategy": "中价带 + 促销节点放量；套装与券类组合。",
    "channelFocus": "Allegro 等本土平台 + Amazon；注意本地语言客服与物流体验。",
    "countryDifferences": "波兰为 TOP20 代表，可扩展至周边时需单独补国家画像。",
    "priorityActions": "① 波语对比素材与规格页；② 大促日历与券策略；③ 评价激励计划。"
  },
  {
    "name": "西欧理性实用区",
    "top20Representatives": [
      "荷兰"
    ],
    "top20Count": 1,
    "customerCharacteristics": "务实、重视功能与长期使用成本；环保与可持续叙事有加分；不宜过度煽情营销。",
    "trustSources": "独立测评、家长论坛、电商长评、品牌透明度（成分/供应链可述）。",
    "contentAngles": "「真实省时间」「长期使用成本」「简洁可信的对比」。",
    "priceStrategy": "中高价可接受，但需理性利益支撑；套装与延保类增值。",
    "channelFocus": "Amazon.nl + Bol 等本土电商；Google 搜索与评测 SEO。",
    "countryDifferences": "荷兰仍是该 cluster 的常见基准国；瑞典、芬兰、挪威与丹麦共同证明北欧子模板必须把公共指导/专业哺乳网络、妈妈论坛理性讨论、比价与药房成交放在同一链路上；丹麦主链应使用 sundhed.dk、Ammenet、Min-Mave、PriceRunner、Webapoteket。",
    "priorityActions": "① 保留西欧理性比较框架；② 并列参考瑞典、芬兰、挪威与丹麦的北欧高信任链；③ 以瑞/芬/挪/丹作为该 cluster 下已正式并入的北欧长尾国家样本。"
  },
  {
    "name": "南亚高移动电商社媒区",
    "top20Representatives": [
      "印度（长尾正式完整版样本）"
    ],
    "top20Count": 0,
    "customerCharacteristics": "价格敏感但规模大，社群和短视频教育权重高；家庭成员影响决策，需强入门教育和性价比说明。",
    "trustSources": "本地 parenting portal、医生/医院内容、头部母婴电商 FAQ、平台长评与问答。",
    "contentAngles": "怎么选第一台、值不值得买、清洗与卫生、返岗/外出真实减负、入门到升级的分层比较。",
    "priceStrategy": "以入门到中价为主，适合节庆活动、优惠券、套装、首单礼；高价必须先解释为什么更省事。",
    "channelFocus": "电商搜索与 FAQ、母婴垂直站、YouTube / Instagram 教程化内容、社群问答。",
    "countryDifferences": "「南亚高移动电商社媒区」在印度落地路径为 **公共叙事+头部育儿媒体+深度指南+品牌印度站+双电商+视频教程**，而非单一直播促销；英文与印地语支线并存，家庭共决明显。",
    "priorityActions": "① 以印度作为南亚高移动电商社媒区已并入正式样本；② 同 cluster 后续国家复制时对照漂移；③ 内容侧优先清单/FAQ 再型号，促销绑定 EMI 与节庆。"
  },
  {
    "name": "MENA 阿语模板（待升级）",
    "top20Representatives": [
      "突尼斯（MENA 正式完整版样本）"
    ],
    "top20Count": 0,
    "customerCharacteristics": "返岗背奶效率妈妈与产后建奶新手妈妈并存；同时受预算、药房可得性、语言路径和储奶执行难度影响。",
    "trustSources": "公共卫生/医院内容、本地返岗与母乳议题、本地妈妈经验、双语教程内容、药房/价格比较站。",
    "contentAngles": "返岗后如何继续喂养、手动/电动/免手持怎么选、储奶与清洗、值不值与升级边界。",
    "priceStrategy": "主流为手动入门与基础电动中价；双边/免手持作为升级补充层；需先解释场景价值再谈品牌溢价。",
    "channelFocus": "公共卫生入口与本地内容站立信任，药房/价格比较站承接成交，品牌零售页补升级层。",
    "countryDifferences": "MENA 阿语模板在突尼斯的落地路径为公共卫生工具包 + 返岗议题 + 妈妈经验 + 双语零售教育 + 药房/价格比较站；相较黎巴嫩，更偏公共卫生和法语/阿语混合药房零售，不应直接套海湾高购买力逻辑。",
    "priorityActions": "① 以突尼斯作为 MENA 阿语模板首个正式并入样本；② 后续同模板国家先校验语言路径与药房承接差异；③ 内容侧优先返岗/储奶/清洗，再讲品牌升级层。"
  },
  {
    "name": "非洲英语模板（待升级）",
    "top20Representatives": [
      "肯尼亚（Africa 正式完整版样本）"
    ],
    "top20Count": 0,
    "customerCharacteristics": "返岗背奶效率妈妈与产后建奶新手妈妈并存；受工作场景、储奶条件、价格带与实际可得性共同影响。",
    "trustSources": "医院/医疗内容、工作母亲研究、本地育儿教育站、品牌在地教育页、本地电商与价格判断内容。",
    "contentAngles": "返岗和通勤如何持续泵奶、手动/电动怎么选、储奶与清洗、值不值和升级边界。",
    "priceStrategy": "主流以手动入门与单电中价为主，双边或医院级/租赁为补充层；需先解释场景价值再谈品牌差价。",
    "channelFocus": "医院/研究立信任，本地育儿站解释使用场景，品牌页补教育，本地电商与零售内容完成价带与成交。",
    "countryDifferences": "非洲英语模板在肯尼亚的落地路径为医院/研究 + 职场返岗场景 + 本地育儿教育 + 品牌在地页 + Jumia/Nova；相较南非，更偏研究和返岗场景驱动，不应直接套成熟零售教育市场逻辑。",
    "priorityActions": "① 以肯尼亚作为非洲英语模板首个正式并入样本；② 后续同模板国家先校验医院/研究与零售成熟度差异；③ 内容侧优先返岗/储奶/清洗，再讲品牌升级层。"
  }
];

export const navItems: NavItem[] = [
  { id: 'overview', label: '项目总览', icon: 'LayoutDashboard' },
  { id: 'top20', label: 'TOP20国家', icon: 'Trophy' },
  { id: 'countries', label: '国家画像', icon: 'Globe' },
  { id: 'products', label: '品线分析', icon: 'Package' },
  { id: 'segments', label: '客群矩阵', icon: 'Users' },
  { id: 'clusters', label: '区域策略', icon: 'Map' },
  { id: 'platforms', label: '平台入口', icon: 'Share2' },
  { id: 'infoSources', label: '信息源质量分层', icon: 'ShieldCheck' },
  { id: 'p1Search', label: 'P1搜索清单', icon: 'Search' },
];
