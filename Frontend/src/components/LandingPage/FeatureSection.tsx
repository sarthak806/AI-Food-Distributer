import { HandPlatter, MapPin, Handshake, Users } from "lucide-react";

export const FeatureSection = () => {
  const features = [
    {
      icon: HandPlatter,
      title: "List your surplus",
      description: "Tell us what food you have, how much, and when it is ready.",
    },
    {
      icon: MapPin,
      title: "Find a nearby need",
      description: "We connect your surplus with schools, shelters, and local groups.",
    },
    {
      icon: Handshake,
      title: "Coordinate pickup",
      description: "Choose a simple pickup window that works for everyone.",
    },
    {
      icon: Users,
      title: "Share the good",
      description: "Food reaches a plate instead of a landfill, right in your community.",
    },
  ];

  return (
    <section id="features" className="bg-[#fbf8f0] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00602d]">
            From extra to essential
          </p>

          <h2 className="mt-3 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-[#10261b]">
            Sharing food is easier than you think.
          </h2>

          <p className="mt-4 text-base leading-7 text-[#536258]">
            A clear, human process that turns a little extra into a meaningful act of care.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group min-h-[126px] rounded-xl border border-[#e1dacb] bg-white p-3 transition hover:border-[#b9cdb8]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#00602d]"><span>0{index + 1}</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f9df91] text-[#00602d]"><Icon className="h-5 w-5" /></span>
                </div>

                <h3 className="mt-4 font-serif text-xl font-bold text-[#10261b]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-[#536258]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};