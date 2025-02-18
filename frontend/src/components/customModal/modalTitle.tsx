export default function CustomModalTitle({ title }: { title: string }) {
	return (
		<div className="modal-title text-mygray">
			<h2 className={` font-semibold text-3xl text-primary uppercase  `}>
				{title}
			</h2>
		</div>
	);
}
