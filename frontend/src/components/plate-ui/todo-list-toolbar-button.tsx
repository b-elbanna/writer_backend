import React from "react";

import { withRef } from "@udecode/cn";
import { Icons } from "@/components/icons";

import { ToolbarButton } from "./toolbar";
import {
	useIndentTodoToolBarButtonState,
	useIndentTodoToolBarButton,
} from "@udecode/plate-indent-list/react";
import { TodoListPlugin } from "@udecode/plate-list/react";

export const TodoListToolbarButton = withRef<
	typeof ToolbarButton,
	{
		nodeType?: string;
	}
>(({ nodeType = TodoListPlugin.key, ...rest }, ref) => {
	const state = useIndentTodoToolBarButtonState({ nodeType });
	const { props } = useIndentTodoToolBarButton(state);

	return (
		<ToolbarButton ref={ref} tooltip={"Todo"} {...props} {...rest}>
			<Icons.check />
		</ToolbarButton>
	);
});
