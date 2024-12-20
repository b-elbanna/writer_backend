import { clientApi } from "@/baseApis/axiosBase";

interface Values {
	qaBoxId: string;
	query: string;
}
export type QABoxAnswerInterface = [string, number, string];

export default function postCreateAnswerBoxAction(values: Values) {
	return clientApi.post<QABoxAnswerInterface[]>(
		`/qa/qa-box/${values.qaBoxId}`,
		{
			q: values.query,
		}
	);
}
