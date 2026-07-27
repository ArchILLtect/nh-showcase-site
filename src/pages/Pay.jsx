/**
 * File: Pay.jsx
 * Description: Public payment page for client payments through Stripe-hosted Checkout.
 */

import React from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { trackVisit } from "../utils/visitTracker";

const paymentLinkUrl = "https://buy.stripe.com/28E00jeCS7ZXdI12jO5wI00";
const supportEmail = "nick@nickhanson.me";

export default function Pay() {
  usePageTitle("Make a Payment");

  React.useEffect(() => {
    trackVisit();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-600 max-w-3xl mx-auto p-6 sm:p-8 mb-24 rounded">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          Nick Hanson Web Consulting
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Make a Payment
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-200 font-medium leading-7">
          Use this page to make a full or partial payment toward an active project,
          invoice, deposit, or service balance.
        </p>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded p-5 sm:p-6 shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
          How Payments Work
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-6">
          <p>
            Payments are processed securely through Stripe. Stripe will send a
            receipt to the email address provided after payment.
          </p>
          <p>
            If you need a formal invoice or updated balance statement, I will
            send that separately.
          </p>
          <p>
            On the Stripe payment page, you can optionally include an invoice
            number, project name, or payment note to help identify what the
            payment is for.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded p-5 shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            ACH / Bank
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-6">
            Usually the lower-fee option. Bank payments may take several business
            days to clear after they are submitted.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded p-5 shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Card
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-6">
            Useful when faster payment confirmation is preferred.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded p-5 sm:p-6 shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Before You Pay
        </h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>You can enter the amount you want to pay in Stripe Checkout.</li>
          <li>Use the same name or email associated with your invoice when possible.</li>
          <li>If prompted, include your invoice number, project name, or business name.</li>
          <li>Payments are applied to project or invoice balances after they clear.</li>
          <li>For questions, email <a className="text-blue-600 dark:text-blue-300 underline" href={`mailto:${supportEmail}`}>{supportEmail}</a>.</li>
        </ul>
      </section>

      <div className="flex flex-col items-center gap-4 text-center">
        <a
          href={paymentLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-600"
        >
          Make a Payment
        </a>

        <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300">
          Payment details are handled by Stripe. This website does not collect or
          store your card or bank account details.
        </p>

        <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300">
          Please only use this page for active projects, invoices, deposits, or
          service balances you have already discussed with Nick Hanson Web Consulting.
        </p>

        <Link to="/contact" className="text-sm text-blue-600 dark:text-blue-300 underline">
          Questions? Contact me first
        </Link>
      </div>
    </div>
  );
}
