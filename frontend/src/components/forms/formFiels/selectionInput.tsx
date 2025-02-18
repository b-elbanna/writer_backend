import { ReactNode } from "react";
import { Field } from "react-final-form";

export default function SelectionInput({
	name,
	label,
	options,
}: {
	name: string;
	label: string;
	options: ReactNode;
}) {
	return (
		<div className="relative ">
			<Field name={name}>
				{({ input, meta }) => (
					<>
						<select
							{...input}
							className={`peer outline-none border-black w-full border-b bg-transparent py-[10px] text-lg  `}
						>
							{options}
						</select>
						<label
							className={`${
								// values[name] &&
								"top-[-23px] text-active !text-base"
							} ${
								meta.error && (meta.touched || meta.modified) && "!text-red-500"
							}   peer-focus:top-[-23px] peer-focus:text-active peer-focus:!text-base   pointer-events-none duration-500 absolute top-0 left-0 py-[10px]`}
						>
							{label}
							{meta.error && (meta.touched || meta.modified) && meta.error}
						</label>
					</>
				)}
			</Field>
		</div>
	);
}
