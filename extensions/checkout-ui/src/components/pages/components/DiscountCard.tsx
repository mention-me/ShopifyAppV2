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
import { RefereeJourneyContext } from "../../../context/RefereeJourneyContext";
import { consoleError } from "../../../../../../shared/logging";
import { ErrorBoundary } from "@sentry/react";

const DiscountCard = () => {
	const applyDiscountCodeChange = useApplyDiscountCodeChange();

	const translate = useTranslate();

	const {
		mentionMeConfig,
		setStep,
		registerResult,
		setErrorState,
	} = useContext(RefereeJourneyContext);

	const [applyingDiscount, setApplyingDiscount] = useState(false);

	const applyCouponCode = useCallback(async () => {
		if (!registerResult?.result?.refereeReward) {
			consoleError("DiscountCard", "No referee reward");
			return;
		}

		if (!registerResult?.result?.refereeReward.couponCode) {
			consoleError("DiscountCard", "Unable to apply code");
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
			setErrorState(`${translate("register-result.error.applying-coupon")}: ${result.message}`);
			return;
		}

		throw new Error("Unexpected result from applyDiscountCodeChange");
	}, [applyDiscountCodeChange, registerResult, setErrorState, setStep, translate]);

	if (!registerResult.result?.refereeReward?.couponCode) {
		return null;
	}

	return (
		<ErrorBoundary beforeCapture={(scope) => {
			scope.setTag("component", "DiscountCard");
			scope.setTag("locale", mentionMeConfig.defaultLocale);
		}}>
			<InlineStack border="base"
						 padding="base"
						 spacing="loose"
			>
				<Icon appearance="accent"
					  size="large"
					  source="discount"
				/>
				<View>
					<TextBlock>
						{registerResult.result.refereeReward.couponCode}
					</TextBlock>
				</View>
			</InlineStack>
			<View>
				<Button loading={applyingDiscount}
						onPress={applyCouponCode}
				>
					{translate("register-result.apply-discount")}
				</Button>
			</View>
		</ErrorBoundary>
	);
};

export default DiscountCard;
