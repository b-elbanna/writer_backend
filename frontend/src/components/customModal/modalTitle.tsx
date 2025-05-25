export default function CustomModalTitle({ title }: { title: string }) {
	return (
		<div className="modal-title">
			<h2 className="text-3xl font-bold text-gray-900 tracking-tight">
				{title}
			</h2>
		</div>
	);
}
