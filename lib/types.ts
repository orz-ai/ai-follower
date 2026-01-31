// 统一类型定义
export type NewsItem = {
    id: number;
    title: string;
    link: string;
    summary?: string | null;
    source: string;
    language?: string | null;
    category?: string | null;
    published_at?: string | null;
    created_at: string;
};

// 插入时的类型（不含 id 和 created_at）
export type NewsInput = Omit<NewsItem, "id" | "created_at"> & {
    created_at?: string;
};

export type SourceItem = {
    name: string;
    url: string;
    language?: string | null;
    category?: string | null;
    enabled: boolean;
};

export type Stats = {
    total_news: number;
};

export type NewsQuery = {
    q?: string;
    source?: string;
    language?: string;
    limit?: number;
    offset?: number;
};
