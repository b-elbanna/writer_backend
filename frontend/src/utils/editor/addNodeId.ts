import { nanoid } from "@udecode/plate";
export default function addIdsToNodes(nodes: any[]): any[] {
	return nodes.map((node) => {
		if (!node.id && !node.text) {
			node.id = nanoid(10);
		}
		if (node.children) {
			node.children = addIdsToNodes(node.children);
		}
		return node;
	});
}
