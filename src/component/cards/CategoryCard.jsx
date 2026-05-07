function CategoryCard({
  title,
  localTitle,
  description,
  icon,
  eta,
  startingPrice,
  onClick,
}) {
  const IconComponent = icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full flex-col rounded-[24px] border border-[#e7ecf1] bg-white p-5 text-left shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)] transition hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f0fbe9] text-[#35a40b]">
          <IconComponent className="h-5 w-5" />
        </span>

        <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
          {eta}
        </span>
      </div>

      <p className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#1d2939]">
        {title}
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#35a40b]">
        {localTitle}
      </p>
      <p className="mt-4 text-sm leading-7 text-[#667085]">{description}</p>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between rounded-[18px] border border-[#edf1f5] bg-[#fafbfc] px-4 py-3">
          <div>
            {/* <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
              Starting rate
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1d2939]">
              {startingPrice}
            </p> */}
          </div>

          <span className="rounded-xl bg-[#59d61c] px-3 py-2 text-xs font-semibold text-white">
            Select
          </span>
        </div>
      </div>
    </button>
  );
}

export default CategoryCard;
