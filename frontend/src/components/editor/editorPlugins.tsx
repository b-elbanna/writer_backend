// import React from "react";
// import {
// 	PlatePlugin,
// 	createPluginFactory,
// 	PlateEditor,
// 	insertNodes,
// } from "@udecode/plate-common/react";
// import { TElement } from "@udecode/slate";

// // Define a unique key for the main pagination plugin
// export const KEY_PAGINATION = "pagination";

// // Define a unique key for the page break element
// export const ELEMENT_PAGE_BREAK = "page_break";

// // --- Page Break Element Component ---
// // This component renders the visual representation of the page break in the editor.
// // It's a void element, meaning it doesn't contain editable text itself.
// const PageBreakElementComponent = (props: any) => {
// 	const { attributes, children, nodeProps } = props;
// 	// Props contain attributes to spread onto the element for Slate to manage it,
// 	// children (which should be empty for void elements), and any custom nodeProps.

// 	return (
// 		// The outer div is the element Slate interacts with.
// 		// data-testid is useful for testing.
// 		<div
// 			{...attributes}
// 			{...nodeProps}
// 			className="my-page-break"
// 			data-testid="page-break"
// 			contentEditable={false}
// 		>
// 			{/* children is rendered here for Slate compatibility, but should be empty */}
// 			{children}
// 			{/* This is the visual representation of the break */}
// 			{/* Added contentEditable={false} above to ensure this part isn't accidentally edited */}
// 			<hr
// 				className="border-t-2 border-dashed border-gray-400 my-4 cursor-pointer"
// 				aria-label="Page break" // Accessibility
// 			/>
// 		</div>
// 	);
// };

// // --- Factory to create the page break element plugin ---
// // This defines the core properties and behavior of the page break element.
// export const createPageBreakPlugin = createPluginFactory({
// 	key: ELEMENT_PAGE_BREAK,
// 	// Identifies this as an element node in the Slate model
// 	isElement: true,
// 	// Crucial: Marks it as a void element. Void elements cannot have children
// 	// edited directly and are treated as a single unit. They require contentEditable={false}.
// 	isVoid: true,
// 	// Assign the React component to render this element
// 	component: PageBreakElementComponent,
// 	// Optional: Define how this element should be serialized to HTML.
// 	// This is useful if you convert Plate's content to HTML output.
// 	// serializeHtml: ({ element }) => {
// 	//   // Example: Render as <hr class="page-break"> in HTML output
// 	//   // Adjust class name as needed to match your CSS or output requirements.
// 	//   return `<hr class="page-break-html" />`; // Use a distinct class for output if needed
// 	// }
// 	// Note: Deserialization (from HTML back to Plate) would require
// 	// defining rules in the createHtmlDeseralizer options if needed.
// });

// // --- Main Pagination Plugin ---
// /**
//  * Plate plugin for visual pagination simulation and manual page breaks.
//  * Relies on CSS for the A4 page styling (see separate CSS artifact).
//  * Includes a plugin for inserting manual page break elements.
//  *
//  * Usage:
//  * 1. Add paginationPlugin to your PlateProvider plugins list.
//  * 2. Ensure the associated CSS (from platejs_pagination_css) is loaded.
//  * 3. Add a toolbar button or command to insert the page break element
//  * (e.g., using insertPageBreak function below).
//  */
// export const paginationPlugin: PlatePlugin = {
// 	key: KEY_PAGINATION,
// 	// Include the page break plugin as a dependency/sub-plugin
// 	plugins: [createPageBreakPlugin()],
// 	// This plugin primarily works through CSS and the included page break plugin.
// 	// More advanced features could potentially use 'withOverrides'.
// 	// withOverrides: (editor) => {
// 	//   // Example: Could potentially normalize content to ensure page breaks
// 	//   // are only at the top level, etc. (adds complexity).
// 	//   return editor;
// 	// }
// };

// // --- Helper Function to Insert Page Break ---
// // You can use this function in a toolbar button's onClick handler.
// export const insertPageBreak = (editor: PlateEditor) => {
// 	if (!editor) return;

// 	// Create the page break node
// 	const pageBreakNode: TElement = {
// 		type: ELEMENT_PAGE_BREAK,
// 		children: [{ text: "" }], // Void elements must have a child text node
// 	};

// 	// Insert the node at the current selection
// 	insertNodes<TElement>(editor, pageBreakNode);
// };
