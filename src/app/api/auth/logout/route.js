export async function POST(req) {
  try {
    // Clear the authentication cookie
    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
      status: 200,
      headers: {
        'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}