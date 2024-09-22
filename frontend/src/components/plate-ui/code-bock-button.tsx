import { withRef } from "@udecode/cn";
import {
	useCodeBlockCombobox,
	useCodeBlockComboboxState,
	useToggleCodeBlockButton,
} from "@udecode/plate-code-block/react";
import { ToolbarButton } from "./toolbar";
import { Icons } from "../icons";

export const CodeBlockToolbarButton = withRef<typeof ToolbarButton>(
	({ ...rest }, ref) => {
		const { props } = useToggleCodeBlockButton();

		return (
			<ToolbarButton ref={ref} tooltip="Code Block" {...props} {...rest}>
				<Icons.codeblock />
			</ToolbarButton>
		);
	}
);
