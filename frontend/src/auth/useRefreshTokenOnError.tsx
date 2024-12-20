import { clientApi, refreshApi } from "@/baseApis/axiosBase";
import { useEffect } from "react";

export default function useRefreshTokenOnError() {
	useEffect(() => {
		const resIntercept = clientApi.interceptors.response.use(
			(res) => res,
			async (err) => {
				let prevReq = err.config;
				// console.log(prevReq)
				if (
					err.response.status === 401 &&
					prevReq.url !== "/auth/token/refresh" &&
					!prevReq.sent
				) {
					prevReq.sent = true;
					try {
						await refreshApi.post("/auth/token/refresh");
					} catch (err) {
						return Promise.reject(err);
					}
					return clientApi(prevReq);
				} else {
					return Promise.reject(err);
				}
			}
		);
		return () => {
			clientApi.interceptors.response.eject(resIntercept);
		};
	}, []);
}
