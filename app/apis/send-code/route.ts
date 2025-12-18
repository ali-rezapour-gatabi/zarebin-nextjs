import { NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/lib/baseUrl';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    const response = await api.post('/identity/send-code', {
      phone,
    });

    if (response.data.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: 'خطای در ارتباط با سرور',
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: response.data.message,
      data: response.data.result,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message ?? error.message ?? 'Request failed',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'خطای در ارتباط با سرور',
      },
      { status: 500 },
    );
  }
}
