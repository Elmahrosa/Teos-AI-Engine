"use client";

import PaymentBlock from "@/components/PaymentBlock";

type Props = {
  plan?: string;
};

export default function PaypalSubmit({ plan }: Props) {
  return <PaymentBlock />;
}
