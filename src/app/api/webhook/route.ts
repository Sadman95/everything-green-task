import crypto from 'crypto';
import ApiError from 'errors/api-error';
import httpStatus from 'http-status';
import { NextRequest, NextResponse } from 'next/server';
import sendResponse from 'utils/send-response';
import { z } from 'zod';
import fs from "fs";
import path from "path"

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? 'your-webhook-secret';

// WEBHOOK SCHEMA
const webhookSchema = z.object({
  eventType: z.string(),
  data: z.record(z.any()),
});

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const expectedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * @summary WEBHOOK VERFICATION
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    if (!signature) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Missing Signature!")
    }

    const payload = await request.text();
    if (!verifySignature(payload, signature)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid signature!');
    }

    const body = JSON.parse(payload);
    const validation = webhookSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { eventType, data } = validation.data;

    const dbPath = path.join(process.cwd(), 'public', 'db.json');
      
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([]));
    }

    const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    dbContent.push({ eventType, data });

    fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2));


    return sendResponse(response, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Received"
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
}
