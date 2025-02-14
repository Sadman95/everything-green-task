import bcrypt from 'bcryptjs';
import ApiError from "errors/api-error";
import httpStatus from 'http-status';
import { signJWT } from "lib/jwt";
import { UserService } from "modules/user/user.service";
import { NextApiResponse } from 'next';
import { NextRequest } from "next/server";
import sendResponse from 'utils/send-response';
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest, response: NextApiResponse) {
	try {
		const body = await request.json();
		const validation = loginSchema.safeParse(body);

		if (!validation.success) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Validation failed!")
		}

		const { email, password } = validation.data;

        const user = await UserService.getUser({ email })

        if(!user) throw new ApiError(httpStatus.NOT_FOUND, "Not Found!");
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) throw new ApiError(httpStatus.CONFLICT, "Password doesn't match!");

		const token = signJWT({ userId: user.id });

        sendResponse(response, {
            statusCode: httpStatus.OK,
            success: true,
            data: {
                token
            }
        });
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal server error!");
	}
}
