import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, QrCode, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast redirects",
    body: "Links resolve server-side in milliseconds, cached in front of the database — not in the browser.",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    body: "Every click is recorded with device and location, so you can see what's actually working.",
  },
  {
    icon: QrCode,
    title: "Clean QR codes",
    body: "Every short link comes with a downloadable QR code, ready for a deck or a poster.",
  },
];

const steps = [
  ["01", "Paste a long URL", "Drop in any link — http, https, or custom protocols."],
  ["02", "Get a short link", "We generate a unique, collision-checked code instantly."],
  ["03", "Track the clicks", "Watch redirects, devices, and locations roll in live."],
];

const faqs = [
  [
    "How does the Trimrr URL shortener work?",
    "You enter a long URL and Trimrr generates a short, unique code for it. Visiting the short link redirects instantly to your original URL while recording the click.",
  ],
  [
    "Is Trimrr free to use?",
    "Yes. You can create as many short links as you need at no cost.",
  ],
  [
    "Can I track clicks on my short links?",
    "Yes. Each link records total clicks along with the device and location of every visitor, shown on your dashboard.",
  ],
  [
    "Are short links permanent?",
    "Short links stay active and keep redirecting to the original URL until you delete them manually.",
  ],
  [
    "Does it work with every kind of URL?",
    "Trimrr works with HTTP, HTTPS, and custom protocols. Paste the link and shorten it.",
  ],
];

const Landing = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  };

  return (
    <div className="flex flex-col gap-28 pb-16">
      {/* Hero */}
      <section className="pt-16 sm:pt-24">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          URL shortener &amp; click analytics
        </span>

        <h1 className="font-serif mt-6 max-w-4xl text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          The only link
          <br />
          you&rsquo;ll need to send.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Turn long, messy URLs into short links that redirect fast and tell you
          exactly who clicked — with a QR code for every one.
        </p>

        <form
          className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
          onSubmit={handleShorten}
        >
          <Input
            type="url"
            value={longUrl}
            placeholder="https://your-really-long-url.com/…"
            className="h-13 flex-1 px-4 text-base"
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button type="submit" size="lg" className="h-13 px-6 text-base">
            Shorten link
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" /> Free to use
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" /> No credit card
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" /> Analytics on
            every link
          </span>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="hairline" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-card p-7">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
          Three steps, no learning curve.
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {steps.map(([num, title, body]) => (
            <div key={num}>
              <span className="font-serif text-2xl text-primary">{num}</span>
              <div className="hairline my-4" />
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
          Questions, answered.
        </h2>
        <Accordion type="single" collapsible className="mt-6 w-full">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default Landing;
