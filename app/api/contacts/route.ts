import prisma from "../../../lib/prisma";

export async function GET(req: Request, res: Response) {
  try {
    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        number: true,
        updatedAt: true
      },
    });
    return new Response(JSON.stringify(contacts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()

    if (!body.name || !body.number) {
      return new Response(
        JSON.stringify({
          message: "name and number must be filled",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = await prisma.contact.create({
      data: {
          name: body.name,
          number: body.number
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json()
    const contact = await prisma.contact.delete({
      where: { id: body.id}
    });
    return new Response(
      JSON.stringify({
        message: "Device deleted: " + body.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  catch {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}