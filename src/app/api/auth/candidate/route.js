import sql from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    const candidates = await sql`
      SELECT * FROM candidates WHERE email = ${email}
    `;

    if (candidates.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const candidate = candidates[0];
    const isValid = await comparePassword(password, candidate.password);

    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      id: candidate.id,
      email: candidate.email,
      name: candidate.name,
      refId: candidate.ref_id,
      role: 'candidate',
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return Response.json({
      success: true,
      user: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        refId: candidate.ref_id,
        role: 'candidate',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}