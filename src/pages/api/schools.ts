import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../lib/db";
import cloudinary from "../../lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

type SchoolType = {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  contact: string;
  email_id?: string;
  image?: string;
  image_id?: string;
};

import formidable from "formidable";
import type { File } from "formidable";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const unwrap = <T>(val: T | T[] | undefined): T | undefined => Array.isArray(val) ? val[0] : val;

      const form = formidable({ multiples: false });
      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: "Error parsing form" });

        const name = unwrap<string>(fields.name as string | string[]);
        const address = unwrap<string>(fields.address as string | string[]);
        const city = unwrap<string>(fields.city as string | string[]);
        const state = unwrap<string>(fields.state as string | string[]);
        const contact = unwrap<string>(fields.contact as string | string[]);
        const email_id = unwrap<string>(fields.email_id as string | string[]);

        const fileObj = unwrap<File>(files.image as File | File[]);
        const file = fileObj?.filepath;
        let imageUrl = "";
        let imageId = "";

        if (file) {
          const uploadResult = await cloudinary.uploader.upload(file, {
            folder: "schools",
          });
          imageUrl = uploadResult.secure_url.replace("http://", "https://");
          imageId = uploadResult.public_id;
        }

        const connection = await getConnection();
        await connection.execute(
          "INSERT INTO schools (name, address, city, state, contact, email_id, image, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [name, address, city, state, contact, email_id, imageUrl, imageId]
        );

        res.status(200).json({ message: "School added successfully" });
      });

    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
      res.status(500).json({ error: errorMessage });
    }
  } else if (req.method === "GET") {
    try {
      const connection = await getConnection();

      // Basic query
      const [rows] = await connection.execute(
        "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
      );

      // Format response (optional, keeps fields consistent)
      const formatted = (rows as SchoolType[]).map((school) => ({
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        image: school.image
      }));

      res.status(200).json(formatted);
    } catch (error) {
      console.error(error);
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
