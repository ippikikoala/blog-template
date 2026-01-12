/**
 * サイドバー設定ファイル
 *
 * このファイルでサイドバー項目の有効/無効と表示順序を一元管理します。
 * order の値が小さい項目ほど上に表示されます。
 * enabled を false にすると、その項目は非表示になります。
 */

export type SidebarItemType =
    | 'profile'
    | 'search'
    | 'archive'
    | 'categories'
    | 'tags'
    | 'recentPosts';

export interface SidebarItemConfig {
    type: SidebarItemType;
    enabled: boolean;
    order: number;
}

/**
 * サイドバー設定
 * 
 * 並び順を変更するには、各項目の order の値を変更してください。
 * 項目を非表示にするには、enabled を false に設定してください。
 */
export const sidebarConfig: SidebarItemConfig[] = [
    { type: 'profile', enabled: true, order: 1 },
    { type: 'search', enabled: true, order: 2 },
    { type: 'archive', enabled: true, order: 5 },
    { type: 'categories', enabled: true, order: 3 },
    { type: 'tags', enabled: true, order: 4 },
    { type: 'recentPosts', enabled: false, order: 6 },
];

/**
 * 有効な項目を order 順にソートして取得
 */
export function getEnabledSidebarItems(): SidebarItemConfig[] {
    return sidebarConfig
        .filter((item) => item.enabled)
        .sort((a, b) => a.order - b.order);
}

/**
 * 特定の項目が有効かどうかを確認
 */
export function isSidebarItemEnabled(type: SidebarItemType): boolean {
    const item = sidebarConfig.find((i) => i.type === type);
    return item?.enabled ?? false;
}
