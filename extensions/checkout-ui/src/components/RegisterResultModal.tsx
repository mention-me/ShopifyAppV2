import {
	Banner,
	BlockLayout,
	Button,
	Modal,
	TextBlock,
	useApplyDiscountCodeChange, useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext, useMemo, useState } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";

export const RegisterResultModal = () => {
	const applyDiscountCodeChange = useApplyDiscountCodeChange();

	const translate = useTranslate();

	const {
		setStep,
		registerResult,
		setErrorState,
	} = useContext(RefereeJourneyContext);

	const [applyingDiscount, setApplyingDiscount] = useState(false);

	const applyCouponCode = useCallback(async () => {
		if (!registerResult.refereeReward.couponCode) {
			console.error("Unable to apply code");
			setErrorState("Unable to apply code");

			return;
		}

		setApplyingDiscount(true);
		const result = await applyDiscountCodeChange({
			type: "addDiscountCode",
			code: registerResult.refereeReward.couponCode,
		});

		if (result.type === "success") {
			setStep("completed-success");
			return;
		}

		if (result.type === "error") {
			setErrorState(translate("register-result.error.applying-coupon"));
			return;
		}

		console.log("applyDiscountCodeChange result", result);
		throw new Error("Unexpected result from applyDiscountCodeChange");
	}, [applyDiscountCodeChange, registerResult?.refereeReward?.couponCode, setErrorState, setStep, translate]);

	const content = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
		return registerResult.content.resource.reduce((acc, curr) => {
			acc[curr.key] = curr.content;

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return acc;
		}, {});
	}, [registerResult]);

	console.log("registerResult", registerResult);
	console.log("content", content);
	return (
		<Modal padding
			   title={content.headline || ""}>
			<BlockLayout>
				<Banner status="success"
						title={registerResult.refereeReward.couponCode}
				/>
				<Button loading={applyingDiscount}
						onPress={applyCouponCode}
				>
					{translate("register-result.apply-discount")}
				</Button>
				<TextBlock>
					{content["voucher-usage-restriction"] || ""}
				</TextBlock>
			</BlockLayout>
		</Modal>
	);
};
