import axios from 'axios'
import type { z } from 'zod'

const isProduction = import.meta.env.PROD

export enum HTTPMethod {
	GET = 'GET',
	POST = 'POST',
}

export enum HTTPStatusCode {
	OK = 200,
}

export default function api<Request, Response>({
	method,
	requestSchema,
	responseSchema,
}: {
	method: HTTPMethod
	requestSchema: z.ZodType<Request>
	responseSchema: z.ZodType<Response>
}): (
	path: string,
	data: Request,
	headers?: Record<string, string>
) => Promise<Response> {
	return function (
		path: string,
		requestData: Request,
		headers?: Record<string, string>
	) {
		requestSchema.parse(requestData)

		async function apiCall() {
			const response = await axios({
				baseURL: "http://localhost:3300/api",
				method,
				url: path,
				headers: headers ?? {},
			})

			if (isProduction) {
				responseSchema.safeParseAsync(response.data).then((result) => {
					if (!result.success) {
						// TODO: Send error to sentry or other error reporting service
					}
				})

				return response.data as Response
			}

			return responseSchema.parse(response.data)
		}

		return apiCall()
	}
}