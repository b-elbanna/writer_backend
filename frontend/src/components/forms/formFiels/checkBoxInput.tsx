import { Field } from "react-final-form";

export function CheckboxInput({
	values,
	name,
	label,
	optionValue,
}: {
	// array

	values: any;
	name: string;
	label: string;
	optionValue: string;
}) {
	return (
		<div className=" group flex gap-2 pb-2  cursor-pointer  ">
			<Field name={name} id={name} type="checkbox" value={optionValue}>
				{({ input, meta }) => (
					<>
						<input
							{...input}
							type="checkbox"
							id={optionValue}
							className={`peer bg-white outline-none -mt-2 border-black  `}
						/>
						<label
							htmlFor={optionValue}
							className={`group-hover:text-active !text-base peer-checked:!text-active cursor-pointer  duration-500 `}
						>
							{label}
						</label>
					</>
				)}
			</Field>
		</div>
	);
}
export function CheckBoxContainer({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="my-7">
			<div className="w-full mb-2 text-lg border-b border-black">{label}</div>
			<div className="w-full px-3 max-h-72  overflow-auto ">{children}</div>
		</div>
	);
}
