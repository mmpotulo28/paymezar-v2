import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";

const faqs = [
  {
    question: "How does the billing cycle work?",
    answer:
      "Your billing cycle starts on the day you subscribe. You'll be billed the same day each month for monthly plans, or annually for yearly plans.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. The new rate will be prorated based on the time remaining in your current billing cycle.",
  },
  {
    question: "How are payments handled?",
    answer:
      "We do not accept manual bank payments. All deposits and withdrawals are processed directly from your connected bank account. You must link a valid South African bank account to use PayMe-Zar.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 7-day money-back guarantee for all plans. If you're not satisfied, contact our support team for a full refund within 7 days of your subscription.",
  },
];

export function FaqSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion variant="bordered">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} title={faq.question}>
            {faq.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
