type IRequest = {
	cpf: string
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*"
};

export default {

	async fetch(request, env, ctx): Promise<Response> {
		// 🔥 PRE-FLIGHT (ESSENCIAL)
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: corsHeaders
			});
		}

		try {
			const body = await request.json() as IRequest;

			if(!body.cpf || body.cpf.length !== 11) {
				return new Response(JSON.stringify({ error: "CPF inválido (edge) "}), { status: 400 });
			}

			// chama backend
			const response = await fetch("http://localhost:3002/api/validate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			});

			const data = await response.text();

			return new Response(data, {
				status: 200,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "*",
					"Content-Type": "application/json"
				}
			});
		} catch (err) {
			return new Response("Erro no worker", { status: 500 })
		}
	},
} satisfies ExportedHandler<Env>;
