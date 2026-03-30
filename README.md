# VOC World Lute

面向目的国 VOC 舆情分析的可视化网站，基于 React + TypeScript + Vite 构建。

## 当前能力

- 国家画像、TOP20 国家、区域 Cluster、平台入口、P1 搜索清单等核心页面
- 国家 × 品线、Cluster × 优先级、主题簇 × 国家等分析矩阵
- 第二期与第三期增强能力：
  - 词云图
  - 国家画像知识图谱
  - 客群原型生命周期分布
  - 筛选联动与分析说明面板

## 本地启动

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

## 数据同步

项目内置 Excel 到静态 TypeScript 数据的转换脚本：

```bash
npm run sync:data
npm run sync:data:build
```

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Radix UI
