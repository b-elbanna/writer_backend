import { Field } from "react-final-form";
import { FieldPropsInterface } from "./types";

export function PasswordInput({ values, name, label }: FieldPropsInterface) {
	return (
		<div className="relative my-7">
			<Field name={name}>
				{({ input, meta }) => (
					<>
						<input
							{...input}
							type="password"
							className={`peer outline-none ${
								meta.error && (meta.touched || meta.modified)
									? "border-red-500"
									: "border-slate-300"
							} !border-black w-full border-b-2 bg-transparent py-[10px]  text-lg `}
						/>

						<label
							className={`${
								values[name] && "top-[-23px] text-secondary !text-base "
							} ${
								meta.error && (meta.touched || meta.modified) && "!text-red-500"
							} peer-focus:top-[-23px] peer-focus:text-secondary peer-focus:!text-base  text-lg   pointer-events-none duration-500 absolute top-0 left-0 py-[10px]`}
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
