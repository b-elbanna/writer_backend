import { Field } from "react-final-form";

export function RadioInput({
	values,
	name,
	labels,
	optionValues,
}: {
	values: any;
	name: string;
	labels: string[];
	optionValues: string[];
}) {
	return (
		<div className=" group flex gap-2 flex-wrap justify-center border-black border-b cursor-pointer  ">
			{optionValues.map((optionValue, i) => (
				<Field name={name} id={name} type="radio" value={optionValue}>
					{({ input, meta }) => (
						<div className="group p-1 flex items-center flex-col ">
							<input
								{...input}
								type="radio"
								id={optionValue}
								className={`peer block bg-white outline-none  border-black  `}
							/>
							<label
								htmlFor={optionValue}
								className={`hover:text-active !text-base peer-checked:!text-active cursor-pointer  duration-500 `}
							>
								{labels[i]}
							</label>
						</div>
					)}
				</Field>
			))}
		</div>
	);
}
