export interface MetaItem {
  title: string;
  display?: string;
  theme?: {
    layout?: string;
    breadcrumb?: boolean;
    sidebar?: boolean;
    toc?: boolean;
  };
  children?: Record<string, MetaItem>;
}

export interface Meta {
  [key: string]: MetaItem | string;
}