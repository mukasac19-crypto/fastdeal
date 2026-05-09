"use client";

import { type FormEvent, useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to send message.");
      }

      event.currentTarget.reset();
      setState("success");
      setMessage("Message sent. FastDeal will contact you soon.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to send message.");
    }
  }

  return (
    <form className="workflow-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" placeholder="Your name" required />
      </label>
      <label>
        Email or phone
        <input name="contact" placeholder="+250 7XX XXX XXX" required />
      </label>
      <label>
        Message
        <textarea name="message" placeholder="How can we help?" required />
      </label>
      <button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
      {message ? <p className={`form-status ${state}`}>{message}</p> : null}
    </form>
  );
}
