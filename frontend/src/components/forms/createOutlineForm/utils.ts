"use client";
import postCreateDescriptionAction from "@/endpointActions/postCreateDescriptionAction";
import React from "react";
import postCreateOutlineAction from "@/endpointActions/postCreateOutlineAction";
import { CreateProjectOutLineDataInterface } from "./createOutlineForm";

export async function onSubmitCreateOutlineFrom(
	values: CreateProjectOutLineDataInterface
) {
	const res = await postCreateOutlineAction({
		title: values.title,
		description: values?.descriptions.join(","),
	});
	return res.data as string;
}
export function validateCreateOutlineForm(
	values: CreateProjectOutLineDataInterface
) {
	const errors: any = {};
	console.log("validateCreateArticleForm");
	if (!values?.descriptions?.length) {
		errors.descriptions = " required";
	}
	if (!values?.title) {
		errors.title = " | required";
	}

	return errors;
}
