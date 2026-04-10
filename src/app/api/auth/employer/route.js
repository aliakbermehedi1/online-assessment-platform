import sql from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    const employers = await sql`
      SELECT * FROM employers WHERE email = ${email}
    `;

    if (employers.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const employer = employers[0];
    const isValid = await comparePassword(password, employer.password);

    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      id: employer.id,
      email: employer.email,
      name: employer.name,
      refId: employer.ref_id,
      role: 'employer',
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
        id: employer.id,
        name: employer.name,
        email: employer.email,
        refId: employer.ref_id,
        role: 'employer',
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