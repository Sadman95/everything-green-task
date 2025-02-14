import { NextResponse } from "next/server";
import { IMeta } from "types";

type IApiResponse<T> = {
	statusCode: number;
	success: boolean;
	message?: string;
	meta?: IMeta;
	data?: T;
	links?: object;
};

const sendResponse = <T>(res: NextResponse, data: IApiResponse<T>) => {
	const responseData: IApiResponse<T> = {
		statusCode: data.statusCode,
		success: data.success,
		message: data.message,
		meta: data.meta,
		data: data.data,
		links: data.links,
	};
	return NextResponse.json({...responseData, status: data.statusCode})
};

export default sendResponse;
