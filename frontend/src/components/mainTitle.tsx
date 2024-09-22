export default function MainTitle({
  title,
  sizeInPx,
}: {
  title: string;
  sizeInPx?: number;
}) {
  return (
    <div className="section-title ">
      <h1
        style={{
          fontSize: `calc(0.5vw + ${sizeInPx ? sizeInPx.toString() : "35"}px)`,
        }}
        className=" font-semibold text-primary uppercase   "
      >
        {title}
      </h1>
      <div className="  w-full h-2 -mt-2 bg-action"></div>
    </div>
  );
}
