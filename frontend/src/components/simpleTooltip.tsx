import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";
// https://www.radix-ui.com/primitives/docs/components/tooltip
export const SimpleTooltip = ({
	tooltip,
	children,
	delay,
}: {
	children: React.ReactNode;
	tooltip?: React.ReactNode;
	delay?: number;
}) => {
	return (
		<Tooltip.Provider delayDuration={delay || 0}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="select-none bg-primary z-[999] text-[12px] max-w-[200px] capitalize rounded-lg text-main  p-2  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
						sideOffset={4}
					>
						{tooltip}
						{/* <Tooltip.Arrow className="fill-primary" /> */}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};
