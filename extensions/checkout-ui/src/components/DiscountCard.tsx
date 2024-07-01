import {
	Button,
	Icon,
	InlineStack,
	TextBlock,
	useApplyDiscountCodeChange,
	useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useState } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";

const DiscountCard = () => {
	const applyDiscountCodeChange = useApplyDiscountCodeChange();

	const translate = useTranslate();

	const {
		setStep,
		registerResult,
		setErrorState,
	} = useContext(RefereeJourneyContext);

	const [applyingDiscount, setApplyingDiscount] = useState(false);

	const applyCouponCode = useCallback(async () => {
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

		console.log("addDiscountCode result:", result);

		if (result.type === "success") {
			setStep("completed-success");
			return;
		}

		if (result.type === "error") {
			setErrorState(`${translate("register-result.error.applying-coupon")}: ${result.message}`);
			return;
		}

		throw new Error("Unexpected result from applyDiscountCodeChange");
	}, [applyDiscountCodeChange, registerResult, setErrorState, setStep, translate]);

	if (!registerResult.result?.refereeReward?.couponCode) {
		return null;
	}

	return (
		<>
			<InlineStack border="base"
						 padding="base"
						 spacing="loose"
			>
				<Icon appearance="decorative"
					  size="large"
					  source="discount"
				/>
				<View>
					<TextBlock>
						{registerResult.result.refereeReward.couponCode}
					</TextBlock>
				</View>
			</InlineStack>
			<Button loading={applyingDiscount}
					onPress={applyCouponCode}
			>
				{translate("register-result.apply-discount")}
			</Button>
		</>
	);
};

export default DiscountCard;
