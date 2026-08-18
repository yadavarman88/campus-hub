type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function Section({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}