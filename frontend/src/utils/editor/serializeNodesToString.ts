import { Node } from "slate";

export default function serializeNodesToString(nodes: any[]) {
	return nodes.map((node) => Node.string(node)).join("\n");
}
