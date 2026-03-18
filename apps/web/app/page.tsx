"use client";

import { useState } from "react";

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [result, setResult] = useState("");

  async function handleValidate() {
    const res = await fetch("https://worker-docs.rafaempresarial312.workers.dev", {
      method: "POST",
      body: JSON.stringify({ cpf })
    });

    const data = await res.text();
    setResult(data);
  }

  return (
    <div>
      <input onChange={(e) => setCpf(e.target.value)} />
      <button onClick={handleValidate}>Validar</button>
      <p>{result}</p>
    </div>
  );
}
