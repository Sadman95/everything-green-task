import ApiError from 'errors/api-error';
import httpStatus from 'http-status';
import { verifyJWT } from 'lib/jwt';
import { UserService } from 'modules/user/user.service';
import { NextRequest, NextResponse } from "next/server";
import sendResponse from 'utils/send-response';
import { z } from "zod";

// USER SCHEMA
const userSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});



/**
 * @summary CREATE NEW USER
 * @param request 
 * @param response 
 * @returns 
 */
export async function POST(request: NextRequest, response: NextResponse) {
	try {
		const body = await request.json();
		const validation = userSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.errors },
				{ status: 400 }
			);
		}

		const { name, email, password } = validation.data;

		const existUser = await UserService.getUser({ email });
		if(existUser) throw new ApiError(httpStatus.BAD_REQUEST, "User already exist!")

		const user = await UserService.createUser({ name, email, password })
		console.log('user: ', user);

        if(!user) throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user!")

        return sendResponse(response, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User created successfully!"
        })

		
	 
	} catch (error) {
		console.log('error: ', error);
		return NextResponse.json(
			{ error: error.message },
			{ status: error.statusCode }
		);
	}
}


/**
 * @summary GET ALL USERS
 * @param request 
 * @param response 
 * @returns 
 */
export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !verifyJWT(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await UserService.getUsers();

	return sendResponse(response, {
	statusCode: httpStatus.OK,
	success: true,
	data: users
});
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
}