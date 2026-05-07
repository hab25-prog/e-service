function PaymentMethodBadge({ name, tone, selected = false }) {
  const toneMap = {
    blue: "border-[#cfe7fb] bg-[#eef7ff] text-[#1d577e]",
    green: "border-[#ccefe1] bg-[#edf9f2] text-[#1b7355]",
    indigo: "border-[#d7dcf9] bg-[#f3f5ff] text-[#435ba0]",
  };

  const colorClass = toneMap[tone] ?? toneMap.blue;

  return (
    <span
      className={`inline-flex min-h-[72px] w-full items-center justify-center rounded-[1.35rem] border px-4 py-4 text-center text-sm font-semibold tracking-[-0.02em] transition ${colorClass} ${
        selected
          ? "ring-2 ring-[#14a79d]/18 shadow-[0_20px_38px_-26px_rgba(20,167,157,0.42)]"
          : "shadow-[0_18px_30px_-28px_rgba(15,40,61,0.22)]"
      }`}
    >
      {name}
    </span>
  );
}

export default PaymentMethodBadge;
