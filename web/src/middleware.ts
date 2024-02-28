import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token_dotcom')?.value

  if(request.nextUrl.pathname === '/auth' && token) {
    return NextResponse.redirect('http://localhost:3000/home')
  } else if (request.nextUrl.pathname === '/'  && token) {
    return NextResponse.redirect('http://localhost:3000/home')
  } else if (request.nextUrl.pathname === '/auth' && !token) {
    return NextResponse.next()
  } else if (request.nextUrl.pathname === '/' && !token) {
    return NextResponse.next()
  } else {
    if (!token) {
      return NextResponse.redirect('http://localhost:3000/auth', {
        headers: {
          'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20`,
        },
      })
    }
  }
}

export const config = {
  matcher: '/((?!api|_next|static|public|favicon.ico).*)'
}
