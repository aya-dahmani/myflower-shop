"use client";

import Image from "next/image";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    if (res.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="inline-block text-xs tracking-[0.2em] uppercase text-burgundy font-medium mb-3">
          Get in touch
        </span>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
          Contact <span className="italic text-burgundy">us</span>
        </h2>
        <p className="text-ivy/60">
          Questions about an order, a custom bouquet, or anything else — we&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-ivy/10 rounded-3xl p-6 md:p-8">
          {status === "error" && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              Something went wrong — please try again.
            </p>
          )}

          <div>
            <label className="text-xs text-ivy/60 mb-1.5 block">Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-ivy/60 mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-ivy/60 mb-1.5 block">Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your number"
              className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-ivy/60 mb-1.5 block">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-burgundy text-cream py-3.5 rounded-full text-sm font-medium hover:bg-ivy transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === "sending" && "Sending..."}
            {status === "sent" && "Message sent!"}
            {(status === "idle" || status === "error") && (
              <>
                Send message
                <Send size={15} />
              </>
            )}
          </button>
        </form>

        <div className="relative rounded-3xl overflow-hidden min-h-105">
          <Image
            src="/images/contact-bg.jpg"
            alt="Fresh flowers"
            fill
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ivy/70" />

          <div className="relative h-full flex flex-col justify-center gap-6 p-6 md:p-8">
            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-full bg-cream/95 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-125 active:scale-125">
                <Mail size={18} className="text-burgundy" strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-xs text-cream/60 mb-1">Email</p>
                <a
                  href="mailto:dahmaya06@gmail.com"
                  className="font-display italic text-lg text-cream hover:text-blush transition-colors"
                >
                  dahmaya06@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-full bg-cream/95 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-125 active:scale-125">
                <Phone size={18} className="text-burgundy" strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-xs text-cream/60 mb-1">Phone</p>
                <a
                  href="tel:+213556453492"
                  className="font-display italic text-lg text-cream hover:text-blush transition-colors"
                >
                  +213 00 00 00000
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-full bg-cream/95 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-125 active:scale-125">
                <MapPin size={18} className="text-burgundy" strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-xs text-cream/60 mb-1">Studio</p>
                <p className="font-display italic text-lg text-cream">Algiers, Algeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}