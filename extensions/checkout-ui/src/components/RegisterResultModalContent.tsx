import {
	Banner,
	Button,
	TextBlock,
	useApplyDiscountCodeChange,
	useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useState } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";

export const RegisterResultModalContent = () => {
	const applyDiscountCodeChange = useApplyDiscountCodeChange();

	const translate = useTranslate();

	const {
		setStep,
		registerResult,
		setErrorState,
	} = useContext(RefereeJourneyContext);

	const [applyingDiscount, setApplyingDiscount] = useState(false);

	const applyCouponCode = useCallback(async () => {
		console.log("registerResult", registerResult);

		if (!registerResult?.result?.refereeReward) {
			console.error("No referee reward");
			return;
		}

		if (!registerResult?.result?.refereeReward.couponCode) {
			console.error("Unable to apply code");
			setErrorState("Unable to apply code");

			return;
		}

		setApplyingDiscount(true);
		const result = await applyDiscountCodeChange({
			type: "addDiscountCode",
			code: registerResult?.result?.refereeReward.couponCode,
		});

		if (result.type === "success") {
			setStep("completed-success");
			return;
		}

		if (result.type === "error") {
			setErrorState(translate("register-result.error.applying-coupon"));
			return;
		}

		throw new Error("Unexpected result from applyDiscountCodeChange");
	}, [applyDiscountCodeChange, registerResult, setErrorState, setStep, translate]);

	if (registerResult?.result.status !== "success") {
		console.log("registerResult failure", registerResult.result);
		return (
			<Banner status="critical"
					title={registerResult.content.detail}
			/>
		);
	}

	return (
		<>
			<Banner status="success"
					title={registerResult.result.refereeReward.couponCode}
			/>
			<Button loading={applyingDiscount}
					onPress={applyCouponCode}
			>
				{translate("register-result.apply-discount")}
			</Button>
			<TextBlock>
				{registerResult.content["voucher-usage-restriction"] || ""}
			</TextBlock>
		</>
	);
};
