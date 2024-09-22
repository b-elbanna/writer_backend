// when call this function
// its check if the timeout is called
// and cleartimeout if its called befar

export default function createTimeoutIfNotExist(
	func: () => void,
	timeoutMs: number
) {
	let timer: string | number | NodeJS.Timeout | undefined;
	return () => {
		if (!timer) {
			timer = setTimeout(() => {
				func();
			}, timeoutMs);
		} else {
			clearTimeout(timer);
			console.log("cleared timer");
		}
	};
}
