import { Field } from "react-final-form";
import { FieldPropsInterface } from "./types";

export default function TextInput({
	values,
	name,
	label,
}: FieldPropsInterface) {
	return (
		<div className="relative my-7">
			<Field name={name}>
				{({ input, meta }) => (
					<>
						<input
							{...input}
							type="text"
							className={`peer outline-none border-black w-full border-b bg-transparent py-[10px] text-lg `}
						/>

						<label
							className={`${
								values[name] && "top-[-23px] text-action !text-base"
							} ${
								meta.error && (meta.touched || meta.modified) && "!text-red-500"
							} peer-focus:top-[-23px] peer-focus:!text-base  text-lg  pointer-events-none duration-500 absolute top-0 left-0 py-[10px] `}
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
