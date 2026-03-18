import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;


describe("CPF Validation", () => {

	it("responds with valid cpf", async () => {
		const request = new IncomingRequest("http://localhost", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cpf: "46181981845",
			}),
		});

		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
	});

	it("responds with invalid cpf", async () => {
		const request = new IncomingRequest("http://localhost", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cpf: "123",
			}),
		});

		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);

		const json = await response.json() as { error: string }
		expect(json.error).toContain("CPF inválido");
	});

	it("responds with status 500", async () => {
		const request = new IncomingRequest("http://localhost", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: "Teste para quebrar "
		})

		const ctx = createExecutionContext();

		const response = await worker.fetch(request, env, ctx)

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(500);

		const text = await response.text();

		expect(text).toContain("Erro no worker")
	})
});
