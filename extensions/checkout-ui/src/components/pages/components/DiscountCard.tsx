import {
	Button,
	Icon,
	InlineStack,
	TextBlock,
	useApplyDiscountCodeChange,
	useSelectedPaymentOptions,
	useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useState } from "react";
import { RefereeJourneyContext } from "../../../context/RefereeJourneyContext";
import { consoleError } from "../../../../../../shared/logging";
import { ErrorBoundary } from "@sentry/react";
import { logError } from "../../../../../../shared/sentry";

const DiscountCard = () => {
	const applyDiscountCodeChange = useApplyDiscountCodeChange();

	const paymentOptions = useSelectedPaymentOptions();

	const translate = useTranslate();

	const {
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

		const couponCode = registerResult?.result?.refereeReward.couponCode;

		if (!couponCode) {
			consoleError("DiscountCard", "Unable to apply code");
			setErrorState("Unable to apply code");

			return;
		}

		setApplyingDiscount(true);
		const result = await applyDiscountCodeChange({
			type: "addDiscountCode",
			code: couponCode,
		});

		if (result.type === "success") {
			setStep("completed-success");
			return;
		}

		if (result.type === "error") {
			const msg = `Error from applyDiscountCodeChange: ${result.message}. Applying coupon ${couponCode}. Selected options are:` + paymentOptions.map((po) => `${po.type}: ${po.handle}`).join(", ");

			logError("DiscountCard", msg, new Error(msg));

			setErrorState(`${translate("register-result.error.applying-coupon")}: ${result.message}`);
			return;
		}

		throw new Error("Unexpected result from applyDiscountCodeChange");
	}, [applyDiscountCodeChange, paymentOptions, registerResult, setErrorState, setStep, translate]);

	if (!registerResult.result?.refereeReward?.couponCode) {
		return null;
	}

	return (
		<ErrorBoundary beforeCapture={(scope, error) => {
			consoleError("DiscountCard", "Error boundary caught error", error);

			scope.setTag("component", "DiscountCard");
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
