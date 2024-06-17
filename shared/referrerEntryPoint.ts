import { Environment } from "./utils";
import { EntryPointForReferrerType } from "@api/mention-me/src/types";

export interface ReferrerEntryPointArgs {
	environment: Environment,
	body: EntryPointForReferrerType,
	setJson: React.Dispatch<any>
}


export const fetchReferrerEntryPoint = async (args: ReferrerEntryPointArgs) => {
	console.log("fetchReferrerEntryPoint", args);

	const { environment, body, setJson } = args;

	// TODO(EHG): Should we override the behaviour to demo when in the editor?
	// Or perhaps just remove the order data? Or set the order value to 0 when set to production?
	let url = "demo.mention-me.com";
	if (environment === "production") {
		url = "mention-me.com";
	} else if (environment === "local") {
		url = "mentionme.dev";
	}

	try {
		const response = await fetch(`https://${url}/api/entry-point/v2/offer`,
			{
				method: "POST",
				// mode: "no-cors",
				credentials: "include",
				headers: { accept: "application/json", "Content-Type": "application/json" },
				body: JSON.stringify(body),
			},
		);

		if (!response.ok) {
			setJson(null);
			console.error("Error calling entrypoint:", response);
			return;
		}

		setJson(await response.json());
	} catch (error) {
		console.error("Error calling entrypoint:", error);
		setJson(null);
	}
};
