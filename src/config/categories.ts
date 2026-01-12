/**
 * カテゴリ（都道府県）階層構造の設定ファイル
 *
 * このファイルで地方区分と都道府県の表示順序を一元管理します。
 * 記事のfrontmatterには都道府県名のみを指定すれば、自動的に地方が判定されます。
 * 
 * テーマ別カテゴリ（IT、小山田壮平など）も管理します。
 */

export interface Prefecture {
  id: string;      // 識別子（英数字、例: 'aomori'）
  name: string;    // 表示名（例: '青森県'）
  order: number;   // 地方内での表示順序
}

export interface Region {
  id: string;            // 識別子（英数字、例: 'tohoku'）
  name: string;          // 表示名（例: '東北'）
  order: number;         // 地方の表示順序
  prefectures: Prefecture[];
}

/**
 * テーマ別カテゴリ（都道府県以外のカテゴリ）
 */
export interface ThemeCategory {
  id: string;      // 識別子（英数字、例: 'it'）
  name: string;    // 表示名（例: 'IT'）
  order: number;   // テーマカテゴリ内での表示順序
}

export interface CategoryConfig {
  regions: Region[];
  themeCategories: ThemeCategory[];
}

/**
 * カテゴリ設定
 * 一般的な8地方区分に基づいた都道府県の階層構造
 */
export const categoryConfig: CategoryConfig = {
  regions: [
    {
      id: 'hokkaido',
      name: '北海道',
      order: 1,
      prefectures: [
        { id: 'hokkaido', name: '北海道', order: 1 },
      ],
    },
    {
      id: 'tohoku',
      name: '東北',
      order: 2,
      prefectures: [
        { id: 'aomori', name: '青森県', order: 1 },
        { id: 'iwate', name: '岩手県', order: 2 },
        { id: 'miyagi', name: '宮城県', order: 3 },
        { id: 'akita', name: '秋田県', order: 4 },
        { id: 'yamagata', name: '山形県', order: 5 },
        { id: 'fukushima', name: '福島県', order: 6 },
      ],
    },
    {
      id: 'kanto',
      name: '関東',
      order: 3,
      prefectures: [
        { id: 'ibaraki', name: '茨城県', order: 1 },
        { id: 'tochigi', name: '栃木県', order: 2 },
        { id: 'gunma', name: '群馬県', order: 3 },
        { id: 'saitama', name: '埼玉県', order: 4 },
        { id: 'chiba', name: '千葉県', order: 5 },
        { id: 'tokyo', name: '東京都', order: 6 },
        { id: 'kanagawa', name: '神奈川県', order: 7 },
      ],
    },
    {
      id: 'chubu',
      name: '中部',
      order: 4,
      prefectures: [
        { id: 'niigata', name: '新潟県', order: 1 },
        { id: 'toyama', name: '富山県', order: 2 },
        { id: 'ishikawa', name: '石川県', order: 3 },
        { id: 'fukui', name: '福井県', order: 4 },
        { id: 'yamanashi', name: '山梨県', order: 5 },
        { id: 'nagano', name: '長野県', order: 6 },
        { id: 'gifu', name: '岐阜県', order: 7 },
        { id: 'shizuoka', name: '静岡県', order: 8 },
        { id: 'aichi', name: '愛知県', order: 9 },
      ],
    },
    {
      id: 'kinki',
      name: '近畿',
      order: 5,
      prefectures: [
        { id: 'mie', name: '三重県', order: 1 },
        { id: 'shiga', name: '滋賀県', order: 2 },
        { id: 'kyoto', name: '京都府', order: 3 },
        { id: 'osaka', name: '大阪府', order: 4 },
        { id: 'hyogo', name: '兵庫県', order: 5 },
        { id: 'nara', name: '奈良県', order: 6 },
        { id: 'wakayama', name: '和歌山県', order: 7 },
      ],
    },
    {
      id: 'chugoku',
      name: '中国',
      order: 6,
      prefectures: [
        { id: 'tottori', name: '鳥取県', order: 1 },
        { id: 'shimane', name: '島根県', order: 2 },
        { id: 'okayama', name: '岡山県', order: 3 },
        { id: 'hiroshima', name: '広島県', order: 4 },
        { id: 'yamaguchi', name: '山口県', order: 5 },
      ],
    },
    {
      id: 'shikoku',
      name: '四国',
      order: 7,
      prefectures: [
        { id: 'tokushima', name: '徳島県', order: 1 },
        { id: 'kagawa', name: '香川県', order: 2 },
        { id: 'ehime', name: '愛媛県', order: 3 },
        { id: 'kochi', name: '高知県', order: 4 },
      ],
    },
    {
      id: 'kyushu_okinawa',
      name: '九州・沖縄',
      order: 8,
      prefectures: [
        { id: 'fukuoka', name: '福岡県', order: 1 },
        { id: 'saga', name: '佐賀県', order: 2 },
        { id: 'nagasaki', name: '長崎県', order: 3 },
        { id: 'kumamoto', name: '熊本県', order: 4 },
        { id: 'oita', name: '大分県', order: 5 },
        { id: 'miyazaki', name: '宮崎県', order: 6 },
        { id: 'kagoshima', name: '鹿児島県', order: 7 },
        { id: 'okinawa', name: '沖縄県', order: 8 },
      ],
    },
  ],
  themeCategories: [
    { id: 'it', name: 'IT', order: 1 },
    { id: 'oyamada', name: '小山田壮平', order: 2 },
  ],
};

