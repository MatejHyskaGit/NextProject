import prisma from "db";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    success: boolean;
    info?: any;
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let { name, description, number } = req.body;

    if (!name || !description || !number) {
        res.status(200).json({ success: false });
    }

    number = parseInt(number);

    await prisma.product.create({
        data: {
            name,
            description,
            number
        }
    });

    res.status(200).json({ success: true });
}