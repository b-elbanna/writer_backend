"use client";
import Loading from "@/app/loading";
import postCreateAnswerBoxAction, {
	QABoxAnswerInterface,
} from "@/endpointActions/postCreateAnswerBoxAction";
import { uuidRegex } from "@/regex/uuid";
import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import { notFound } from "next/navigation";
import { useState } from "react";
import QABoxResult from "./qaboxResult";
import QABoxUploadResource from "./qaboxUploadResource";

export default function QABox({
	id,
	className,
}: {
	id: any;
	className?: string;
}) {
	const { qaBox, isLoading, isError } = useCurrentQaBoxFetcher(id);
	const [answers, setAnswers] = useState<QABoxAnswerInterface[]>();

	if (id && !uuidRegex.test(id)) return notFound();
	if (isError)
		return (
			<div className="text-red-500 text-center text-xl">Failed to load</div>
		);
	return (
		<div className={className}>
			{isLoading ? (
				<Loading />
			) : (
				<div>
					<h2 className="m-5">QA Box {`${qaBox.name} | ${id}`}</h2>
					<QABoxUploadResource qaBoxId={id} />

					<div>
						<input
							type="text"
							className="text-center block m-4 mx-auto max-w-[500px] p-5 text-lg outline-none bg-main rounded-full"
							onKeyDown={async (e) => {
								if (e.key === "Enter") {
									const v = e.currentTarget.value;
									e.currentTarget.value = "";
									const res = await postCreateAnswerBoxAction({
										qaBoxId: id,
										query: v,
									});
									setAnswers(res.data);
								}
							}}
						/>
						<div>
							{answers?.map((answer) => {
								return <QABoxResult key={answer[1]} qaBoxResult={answer} />;
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
