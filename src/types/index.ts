export type IMeta = {
	page: number;
	limit: number;
	total?: number;
	totalPages?: number;
	nextPage?: number;
	prevPage?: number;
};

export type IUserFilterableOptions = {
	searchTerm?: string;
	id?: string;
	gender?: string;
	isEmailVerified?: boolean;
	isContactNoVerified?: boolean;
	role?: string;
};

export type IPaginationOptions = {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
};

export type IPaginationData = Required<IPaginationOptions> & {
	skip: number;
};

export type IGenericResponse<T> = {
	meta: IMeta;
	data: T;
	links?: { [key: string]: string };
};
