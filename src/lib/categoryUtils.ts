import { categoryConfig, type Region, type Prefecture } from "@/config/categories";

/**
 * 都道府県と地方の情報を含む型
 */
export interface PrefectureWithRegion {
  prefecture: string;     // 都道府県名（例: '青森県'）
  region: string;         // 地方名（例: '東北'）
  regionOrder: number;    // 地方の表示順序
  prefectureOrder: number; // 都道府県の表示順序
}

/**
 * 都道府県名から地方名を取得
 * @param prefecture 都道府県名（例: '青森県'）
 * @returns 地方名（例: '東北'）、見つからない場合はnull
 */
export function getPrefectureRegion(prefecture: string): string | null {
  for (const region of categoryConfig.regions) {
    const found = region.prefectures.find((p) => p.name === prefecture);
    if (found) {
      return region.name;
    }
  }
  return null;
}

/**
 * すべての都道府県を地方情報付きで取得（設定順）
 * @returns 都道府県と地方の情報を含む配列
 */
export function getAllPrefectures(): PrefectureWithRegion[] {
  const result: PrefectureWithRegion[] = [];

  for (const region of categoryConfig.regions) {
    for (const prefecture of region.prefectures) {
      result.push({
        prefecture: prefecture.name,
        region: region.name,
        regionOrder: region.order,
        prefectureOrder: prefecture.order,
      });
    }
  }

  return result;
}

/**
 * 指定した地方に属する都道府県名の配列を取得
 * @param regionName 地方名（例: '東北'）
 * @returns 都道府県名の配列（例: ['青森県', '岩手県', ...]）
 */
export function getRegionPrefectures(regionName: string): string[] {
  const region = categoryConfig.regions.find((r) => r.name === regionName);
  if (!region) {
    return [];
  }
  return region.prefectures.map((p) => p.name);
}

/**
 * カテゴリを正規化（文字列 or 配列 → 配列）
 * @param category 文字列または配列形式のカテゴリ
 * @returns 都道府県名の配列
 */
export function normalizeCategory(
  category: string | string[] | undefined
): string[] {
  if (!category) {
    return [];
  }
  return Array.isArray(category) ? category : [category];
}

/**
 * 都道府県名→地方名のマッピングオブジェクトを取得
 * @returns { '青森県': '東北', '岩手県': '東北', ... }
 */
export function getPrefectureToRegionMap(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const region of categoryConfig.regions) {
    for (const prefecture of region.prefectures) {
      map[prefecture.name] = region.name;
    }
  }

  return map;
}

/**
 * すべての地方情報を取得（設定順）
 * @returns 地方情報の配列
 */
export function getAllRegions(): Region[] {
  return [...categoryConfig.regions].sort((a, b) => a.order - b.order);
}

/**
 * カテゴリ（都道府県）の表示順序を取得
 * @param prefectureName 都道府県名
 * @returns { regionOrder: number, prefectureOrder: number } または null
 */
export function getCategoryOrder(
  prefectureName: string
): { regionOrder: number; prefectureOrder: number } | null {
  for (const region of categoryConfig.regions) {
    const prefecture = region.prefectures.find((p) => p.name === prefectureName);
    if (prefecture) {
      return {
        regionOrder: region.order,
        prefectureOrder: prefecture.order,
      };
    }
  }
  return null;
}

/**
 * 複数カテゴリから重複のない地方リストを取得
 * @param categories 都道府県名の配列
 * @returns ユニークな地方名の配列
 */
export function getUniqueRegionsFromCategories(categories: string[]): string[] {
  const regions = new Set<string>();

  for (const category of categories) {
    const region = getPrefectureRegion(category);
    if (region) {
      regions.add(region);
    }
  }

  return Array.from(regions);
}
