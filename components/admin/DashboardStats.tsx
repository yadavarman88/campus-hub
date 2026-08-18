type Props = {
  totalResources: number;
};

export default function DashboardStats({
  totalResources,
}: Props) {
  const cards = [
    {
      title: "Resources",
      value: totalResources,
    },
    {
      title: "Subjects",
      value: 1,
    },
    {
      title: "Semesters",
      value: 8,
    },
  ];

  return (
    <div className="mb-10 grid gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-6"
        >
          <p className="text-sm text-gray-400">
            {card.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}