import SearchProblems from "@/icons/search_problems.svg";

export default function SearchFialedPage() {
  return (
    <div className="text-center h-full flex">
      {/* <p className="font-bold py-4">
                there is no results available with this title
            </p> */}
      <SearchProblems className="w-[150px]  mx-auto dark:fill-[#94a3b8]" />
    </div>
  );
}
