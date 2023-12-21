
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const number = searchParams.get('number');
 
  try {
    if (!name || !number) throw new Error('Name and number required');
    await sql`INSERT INTO Contacts (Name, Number) VALUES (${name}, ${number});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
 
  const contacts = await sql`SELECT * FROM Contacts;`;
  return NextResponse.json({ contacts }, { status: 200 });
}








/*
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const result =
      await sql`CREATE TABLE contacts1 ( Name varchar(255), Number varchar(255));`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}*/



/*
export async function GET(req: Request, res: Response) {
    return new Response(JSON.stringify({
      message: "Hello",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }*/