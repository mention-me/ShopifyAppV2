import { Environment, getDomainForEnvironment } from "./utils";
import { EntryPointForReferrerType, EntryPointOfferAndLink } from "@api/entry-point-api/src/types";

export interface ReferrerEntryPointArgs {
	environment: Environment,
	body: EntryPointForReferrerType,
	setJson: React.Dispatch<EntryPointOfferAndLink>
}


export const fetchReferrerEntryPoint = async (args: ReferrerEntryPointArgs) => {
	const { environment, body, setJson } = args;

	// TODO(EHG): Should we override the behaviour to demo when in the editor?
	// Or perhaps just remove the order data? Or set the order value to 0 when set to production?
	const url = getDomainForEnvironment(environment);

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
