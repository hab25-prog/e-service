import { ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function AuthSplitLayout({
  eyebrow,
  title,
  description,
  highlights = [],
  stats = [],
  sideAction,
  children,
}) {
  return (
    <main className="min-h-svh bg-[#f6f7fb] px-4 py-8">
      <section className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[32px] border border-[#e7ecf1] bg-white p-6 shadow-[0_20px_44px_-36px_rgba(15,23,42,0.18)] md:p-8 xl:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#59d61c] text-white shadow-[0_16px_30px_-22px_rgba(89,214,28,0.55)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-semibold tracking-[-0.03em] text-[#35a40b]">
                  EthioTech
                </span>
                <span className="block text-xs uppercase tracking-[0.22em] text-[#98a2b3]">
                  Service access
                </span>
              </span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#e4e9ef] bg-white px-4 py-2 text-sm font-medium text-[#667085] transition hover:bg-[#f8fafc] hover:text-[#1d2939]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>

          <p className="kicker mt-10 text-[#35a40b]">{eyebrow}</p>
          <h1 className="page-title mt-4 text-[#1d2939]">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#667085]">
            {description}
          </p>

          {highlights.length ? (
            <div className="mt-8 grid gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] px-5 py-4 text-sm leading-6 text-[#667085]"
                >
                  {item}
                </div>
              ))}
            </div>
          ) : null}

          {stats.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-[#edf1f5] bg-[#f8fbf6] p-4"
                >
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-[#1d2939]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-[#667085]">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          {sideAction ? <div className="mt-8">{sideAction}</div> : null}
        </article>

        <article className="rounded-[32px] border border-[#e7ecf1] bg-white p-6 shadow-[0_20px_44px_-36px_rgba(15,23,42,0.18)] md:p-8 xl:p-10">
          {children}
        </article>
      </section>
    </main>
  );
}

export default AuthSplitLayout;
