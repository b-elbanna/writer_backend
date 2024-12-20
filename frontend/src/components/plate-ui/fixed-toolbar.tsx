import { withCn } from "@udecode/cn";

import { Toolbar } from "./toolbar";

export const FixedToolbar = withCn(
	Toolbar,
	"shadow-md supports-backdrop-blur:bg-background/60 relative left-0 top-0 z-10 w-full justify-between overflow-x-auto	 "
);
