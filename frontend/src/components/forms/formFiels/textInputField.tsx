import { Field } from "react-final-form";
import { FieldPropsInterface } from "./types";

export default function TextInput({
	values,
	name,
	label,
}: FieldPropsInterface) {
	return (
		<div className="relative">
			<Field name={name}>
				{({ input, meta }) => (
					<>
						<input
							{...input}
							type="text"
							className={`peer w-full px-3 py-2.5 bg-white border ${
								meta.error && (meta.touched || meta.modified)
									? "border-destructive focus:ring-destructive/30"
									: "border-gray-300 focus:border-action"
							} rounded-lg text-sm placeholder-gray-400 
							focus:outline-none focus:ring-2 focus:ring-action/20 
							transition-all duration-200
							sm:text-base`}
							placeholder=" "
						/>
						<label
							className={`absolute text-sm sm:text-base duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
								bg-white px-2 peer-placeholder-shown:px-2 peer-focus:px-2
								left-1 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-medium
								peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
								peer-placeholder-shown:text-gray-500 peer-focus:text-action
								sm:peer-focus:text-sm
								${values[name] ? "text-gray-600" : ""}
								${
									meta.error && (meta.touched || meta.modified)
										? "text-destructive peer-focus:text-destructive"
										: ""
								}
							`}
						>
							{label}
						</label>
						{meta.error && (meta.touched || meta.modified) && (
							<p className="mt-1 text-xs text-destructive">{meta.error}</p>
						)}
					</>
				)}
			</Field>
		</div>
	);
}
