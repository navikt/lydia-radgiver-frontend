import { PadlockLockedIcon } from "@navikt/aksel-icons";
import { Checkbox, Tooltip } from "@navikt/ds-react";
import styled from "styled-components";

export default function LåsbarCheckbox({
	låst,
	value,
	children,
	tooltipText,
	...remainingProps
}: {
	låst: boolean;
	tooltipText?: string;
} & React.ComponentProps<typeof Checkbox>) {
	if (låst && tooltipText) {
		return (
			<Tooltip content={tooltipText} defaultOpen={false}>
				<StyledCheckbox value={value} readOnly {...remainingProps}>
					<PadlockLockedIcon title="rad er låst" fontSize="1.5rem" />
					{children}
				</StyledCheckbox>
			</Tooltip>
		);
	}

	if (låst) {
		return (
			<StyledCheckbox value={value} readOnly {...remainingProps}>
				<PadlockLockedIcon title="rad er låst" fontSize="1.5rem" />
				{children}
			</StyledCheckbox>
		);
	}

	return (
		<StyledCheckbox value={value} {...remainingProps}>
			{children}
		</StyledCheckbox>
	);
}

const StyledCheckbox = styled(Checkbox)`
.navds-checkbox__label {
	.navds-checkbox__content {
		.navds-checkbox__label-text {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
`;
