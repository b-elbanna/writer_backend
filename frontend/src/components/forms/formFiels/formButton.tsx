import { ButtonFieldPropsInterface } from "./types";

export default function FormButton({
	label,
	className,
	submitting,
}: ButtonFieldPropsInterface) {
	return (
		<button
			className={`flex items-center justify-center w-full px-4 py-2.5 sm:py-3 rounded-lg font-semibold tracking-wide text-sm sm:text-base transition-all duration-200 ease-out
				${
					submitting
						? "opacity-70 cursor-not-allowed"
						: "hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
				}
				${className || "bg-action hover:bg-action/90 text-white shadow-md"}
			`}
			type="submit"
			disabled={submitting}
		>
			{submitting ? (
				<>
					<svg
						className="animate-spin -ml-1 mr-2 h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Processing...
				</>
			) : (
				label
			)}
		</button>
	);
}
