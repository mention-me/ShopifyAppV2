export const consoleError = (context: string, message: string, ...optionalParams) => {
	console.error(`Mention Me [${context}] error:`, message, optionalParams);
};
