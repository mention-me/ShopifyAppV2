import { Environment } from "../../../shared/utils";
import { EntryPointForRefereeType } from "@api/mention-me/src/types";

export interface RefereeEntryPointArgs {
	environment: Environment,
	body: EntryPointForRefereeType,
	setJson: React.Dispatch<any>
}

export const fetchRefereeEntryPoint = async (args: RefereeEntryPointArgs) => {
	console.log("fetchRefereeEntryPoint", args);

	const { environment, body, setJson } = args;

	let url = "demo.mention-me.com";
	if (environment === "production") {
		url = "mention-me.com";
	} else if (environment === "local") {
		url = "mentionme.dev";
	}

	try {
		const response = await fetch(`https://${url}/api/entry-point/v2/referee`,
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
