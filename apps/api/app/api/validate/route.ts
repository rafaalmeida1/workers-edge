import { validateCpf } from "@repo/documents/validate-cpf";

export async function POST(req: Request) {
    const body = await req.json();

    if(!validateCpf(body.cpf)) {
        return Response.json({ error: "CPF inválido" }, { status: 400 })
    }

    // simulação de validação pesada
    await new Promise((r) => setTimeout(r, 1000));

    return Response.json({ valid: true });
}