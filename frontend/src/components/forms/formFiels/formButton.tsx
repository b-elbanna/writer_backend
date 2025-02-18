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
			} outline-2 outline m-[2px] text-sm outline-primary border rounded-sm font-semibold bg-hover hover:bg-primary text-white active:bg-primary tracking-[1px] capitalize pointer-events-auto relative  inline-block py-1 px-3 cursor-pointer duration-500 `}
			type="submit"
			disabled={submitting}
		>
			{label}
		</button>
	);
}
