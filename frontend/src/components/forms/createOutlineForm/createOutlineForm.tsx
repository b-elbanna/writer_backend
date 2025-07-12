"use client";

import { Form } from "react-final-form";
import FormButton from "../formFiels/formButton";
import { CheckBoxContainer, CheckboxInput } from "../formFiels/checkBoxInput";
import { onSubmitCreateOutlineFrom, validateCreateOutlineForm } from "./utils";
import addIdsToNodes from "@/utils/editor/addNodeId";
import useMyEditor from "@/components/editor/editorBuilder";
import { useContext } from "react";
import { ProjectDataContext } from "@/components/projectCreationSection/projectCreationForms";
import serializeNodesToString from "@/utils/editor/serializeNodesToString";

export interface CreateProjectOutLineDataInterface {
	title: string;
	descriptions: string[];
}

export default function CreateOutlineForm() {
	const theEditor = useMyEditor();
	const { projectData, setProjectData } = useContext(ProjectDataContext);
	console.log(theEditor.api.string());
	return (
		<Form
			onSubmit={async (v) => {
				await onSubmitCreateOutlineFrom(v).then((markdownOutline) => {
					let outLine = theEditor.api.markdown.deserialize(markdownOutline);
					outLine = addIdsToNodes(outLine);
					let article_text = serializeNodesToString(outLine);
					setProjectData({
						...projectData,
						outline: outLine,
						markdownOutline,
						article_text,
					});
				});
			}}
			validate={validateCreateOutlineForm}
			initialValues={{
				title: projectData.title,
			}}
			render={({
				handleSubmit, //
				form, // form.reset
				submitSucceeded, //
				submitting, // submitting status use it to disable button
				values, // form values
				errors,
			}) => {
				return (
					<form onSubmit={handleSubmit} className={`my-5 ${submitting}`}>
						<CheckBoxContainer label="Chose descriptions that match your target: ">
							<>
								<p className="text-red-500 py-2 h-10">
									{errors?.descriptions && errors?.descriptions}
								</p>
								{projectData.descriptions?.map((description, i) => {
									// console.log(description);
									return (
										<CheckboxInput
											key={i}
											optionValue={description}
											label={description}
											name="descriptions"
											values={values}
										/>
									);
								})}
							</>
						</CheckBoxContainer>

						<div className="buttons flex justify-end mt-10">
							<div className="w-full sm:w-auto">
								<FormButton
									label={
										submitSucceeded ? "Regenerate Outline" : "Generate Outline"
									}
									submitting={submitting}
								/>
							</div>
						</div>
					</form>
				);
			}}
		/>
	);
}
