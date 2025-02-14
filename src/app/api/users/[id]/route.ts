import ApiError from 'errors/api-error';
import httpStatus from 'http-status';
import { verifyJWT } from "lib/jwt";
import { UserService } from "modules/user/user.service";
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import sendResponse from 'utils/send-response';

/**
 * @summary GET USER BY ID
 * @param request 
 * @param response 
 * @param params
 * @returns 
 */
export async function GET(
  request: NextRequest,
  response:NextResponse,
  { params }: { params: { id: string } }
) {
    try {      
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !verifyJWT(token)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized! Access Denied");
    }

    const paramId = params.id;
    const user = await UserService.getUser({
      id: new mongoose.Schema.ObjectId(paramId),
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found!');
    }

    return sendResponse(response, {
      statusCode: httpStatus.OK,
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
}
