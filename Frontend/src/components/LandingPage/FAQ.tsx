import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import axios from "axios";

interface Faq {
  question: string;
  answer: string;
}

const fallbackFaqs: Faq[] = [
  {
    question: "What is SharePlate?",
    answer:
      "SharePlate is a food-sharing platform that connects surplus food with people and organizations that need it.",
  },
  {
    question: "Who can donate food?",
    answer:
      "Individuals, restaurants, cafés, grocery stores, event organizers, and community groups can list safe surplus food.",
  },
  {
    question: "Who can request food?",
    answer:
      "Individuals, NGOs, shelters, and community organizations can browse available donations and request support.",
  },
  {
    question: "Is SharePlate free to use?",
    answer:
      "Yes. SharePlate is designed to make food sharing accessible to everyone in the community.",
  },
  {
    question: "How do I arrange collection?",
    answer:
      "After a request is accepted, the donor and recipient can coordinate the collection details through the platform.",
  },
];

const FAQ = () => {
  const [faqData, setFaqData] = useState<Faq[]>(fallbackFaqs);

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_Backend_URL}/api/faq`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setFaqData(response.data);
        }
      } catch {
        setFaqData(fallbackFaqs);
      }
    };

    fetchFaqData();
  }, []);

  return (
    <section id="faq" className="bg-[#fbf8f0] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-12">
        <div className="text-center">
          <div className="mx-auto flex h-5 w-5 items-center justify-center text-[#00602d]">
            <HelpCircle className="h-4 w-4" />
          </div>

          <h2 className="mt-3 font-serif text-3xl font-bold text-[#10261b]">
            Questions, answered.
          </h2>
        </div>

        <div className="mx-auto mt-6 max-w-3xl space-y-0">
          {faqData.map((faq) => (
            <details
              key={faq.question}
              className="group border-y border-[#ddd6c6] transition hover:border-[#b8ccb8]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-sm font-bold text-[#10261b]">
                <span>{faq.question}</span>

                <ChevronDown className="h-3 w-3 shrink-0 text-[#00602d] transition-transform duration-300 group-open:rotate-180" />
              </summary>

              <div className="pb-3 text-[#536258]">
                <p className="text-sm leading-6">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;