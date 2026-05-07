import {
  Clock3,
  LifeBuoy,
  MapPin,
  MessageSquareText,
  Phone,
  Wallet,
} from "lucide-react";
import {
  paymentOptions,
  serviceCoverage,
  supportChannels,
  supportFaqs,
} from "../data/mockData";
import PaymentMethodBadge from "../ui/PaymentMethodBadge";

function Support() {
  return (
    <section className="space-y-6">
      <div className="surface-panel-dark rounded-[38px] px-6 py-7 text-white md:px-7 md:py-8">
        <div className="relative">
          <p className="kicker text-[#c8f2ec]">Support and coverage</p>
          <h1 className="section-title mt-3 text-white">
            Help channels, coverage details, and payment guidance in one modern support view
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d2e8f0]">
            The support area now feels like part of the main product instead of
            an afterthought, with clearer cards for coverage, contact paths, and
            common booking questions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {supportChannels.map((channel, index) => (
          <article key={channel.title} className="surface-card rounded-[32px] p-5">
            <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] bg-[#eef7ff] text-[#0d8b83]">
              {index === 0 ? (
                <Phone className="h-5 w-5" />
              ) : index === 1 ? (
                <MessageSquareText className="h-5 w-5" />
              ) : (
                <LifeBuoy className="h-5 w-5" />
              )}
            </div>
            <p className="mt-4 text-lg font-semibold text-[#163047]">
              {channel.title}
            </p>
            <p className="mt-2 text-sm font-semibold text-[#0d8b83]">
              {channel.value}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#607483]">
              {channel.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.06fr_0.94fr]">
        <article className="surface-panel rounded-[38px] p-6 md:p-7">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] bg-[#e9f7f3] text-[#0d8b83]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="kicker text-[#0d8b83]">Coverage</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#163047]">
                Cities and service windows
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {serviceCoverage.map((area) => (
              <div
                key={area.city}
                className="rounded-[28px] border border-[#e6edf1] bg-[#fbfdff] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-[#163047]">
                    {area.city}
                  </p>
                  <span className="rounded-full bg-[#edf7ff] px-3 py-1.5 text-xs font-semibold text-[#1d577e]">
                    {area.eta}
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-[#546a7b]">
                  Popular areas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {area.zones.map((zone) => (
                    <span
                      key={zone}
                      className="rounded-full bg-[#f3f7fa] px-3 py-1.5 text-[11px] font-medium text-[#5d7180]"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-[#607483]">
                  <Clock3 className="h-4 w-4 text-[#0d8b83]" />
                  {area.supportHours}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-panel-dark rounded-[38px] p-6 text-white md:p-7">
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] bg-white/10 text-[#8ee6da]">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="kicker text-[#c8f2ec]">Payments</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Local payment choices customers already understand
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {paymentOptions.map((option, index) => (
                <div
                  key={option.name}
                  className="rounded-[28px] border border-white/12 bg-white/8 p-4"
                >
                  <PaymentMethodBadge
                    name={option.name}
                    tone={option.tone}
                    selected={index === 0}
                  />
                  <p className="mt-4 text-sm leading-7 text-[#d7ecf2]">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <article className="surface-panel rounded-[38px] p-6 md:p-7">
        <p className="kicker text-[#0d8b83]">Frequently asked questions</p>
        <h2 className="section-title mt-3 text-[#163047]">
          Answers for the most common booking concerns
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {supportFaqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-[28px] border border-[#e6edf1] bg-[#fbfdff] p-5"
            >
              <p className="text-lg font-semibold tracking-[-0.03em] text-[#163047]">
                {faq.question}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#607483]">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default Support;
