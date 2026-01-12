import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "About",
  description: "いっぴきこあらの大冒険について",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1">
          <article className="card p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--color-primary-dark)]">
              About
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-8">
                <img
                  src="/ippikikoala_profile.png"
                  alt="いっぴきこあら"
                  className="inline-block w-32 h-32 rounded-full object-cover"
                />
              </div>

              <h2>いっぴきこあらの大冒険</h2>
              <p>
                日本各地の昔栄えていた街を巡るブログです。
                鄙びた集落・旅館・廃線・温泉が好きです。
                α6400 / Vigore ロードバイク
              </p>

              <h2>著者について</h2>
              <p>
                関東在住。妻と2人で暮らしています。
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
