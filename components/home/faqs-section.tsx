"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

const faqs = [
  {
    question: "What is PayMe-Zar?",
    answer:
      "PayMe-Zar is a platform for sending, receiving, and managing ZAR stablecoin payments instantly and securely.",
  },
  {
    question: "How do I get started?",
    answer:
      "Just sign up, verify your email, and you can start sending or receiving ZAR stablecoins right away.",
  },
  {
    question: "Is it safe to use?",
    answer:
      "Yes, we use bank-grade encryption and never share your data with third parties.",
  },
  {
    question: "Can I withdraw to my bank?",
    answer:
      "Absolutely! Withdraw your ZAR stablecoins to any South African bank account.",
  },
];

export function FaqsSection() {
  return (
    <section className="w-full max-w-3xl mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion variant="bordered">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} title={faq.question}>
            {faq.answer}
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex justify-center mt-4">
        <Link
          className={buttonStyles({
            color: "secondary",
            radius: "full",
            variant: "flat",
            size: "md",
          })}
          href="/support/faq"
        >
          More FAQs
        </Link>
      </div>
    </section>
  );
}
