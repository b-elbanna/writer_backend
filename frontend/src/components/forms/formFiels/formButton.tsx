import { ButtonFieldPropsInterface } from "./types";

export default function FormButton({
	label,
	className,
	submitting,
}: ButtonFieldPropsInterface) {
	return (
		<button
			className={`${
				className && className
			} outline-2 outline m-[2px] outline-primary border rounded-sm font-semibold bg-hover hover:bg-primary text-white active:bg-primary active:text-white tracking-[2px] uppercase pointer-events-auto relative  inline-block py-[10px] px-5 cursor-pointer duration-500 `}
			type="submit"
			disabled={submitting}
		>
			{label}
		</button>
	);
}
