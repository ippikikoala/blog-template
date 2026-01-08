import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "About",
  description: "いっぴきこあらの大冒険について",
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <article className="card p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--color-primary-dark)]">
              About
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-8">
                <div className="inline-block w-32 h-32 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-6xl">
                  🐨
                </div>
              </div>

              <h2>いっぴきこあらの大冒険</h2>
              <p>
                鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログです。
                写真を主体としたコンテンツで、日本各地の魅力的なスポットを紹介しています。
              </p>

              <h2>このブログについて</h2>
              <p>
                当ブログでは、観光地化されていない素朴な風景や、
                地方の温泉旅館、廃線跡、炭鉱跡、離島などを訪ねた記録を公開しています。
              </p>

              <h2>著者について</h2>
              <p>
                ひねくれ夫婦で日本各地をドライブ旅行しています。
                有名な観光地よりも、人があまり訪れない場所に惹かれます。
              </p>

              <h2>お問い合わせ</h2>
              <p>お問い合わせはTwitterのDMからお願いします。</p>
            </div>
          </article>
        </main>
        <div className="lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
