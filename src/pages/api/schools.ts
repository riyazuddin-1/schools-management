import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../lib/db";
import cloudinary from "../../lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const unwrap = (val: any) => (Array.isArray(val) ? val[0] : val);

      const form = formidable({ multiples: false });
      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: "Error parsing form" });

        const name = unwrap(fields.name);
        const address = unwrap(fields.address);
        const city = unwrap(fields.city);
        const state = unwrap(fields.state);
        const contact = unwrap(fields.contact);
        const email_id = unwrap(fields.email_id);

        const file = unwrap(files.image)?.filepath;
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

    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const connection = await getConnection();

      // Basic query
      const [rows] = await connection.execute(
        "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
      );

      // Format response (optional, keeps fields consistent)
      const formatted = (rows as any[]).map((school) => ({
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        image: school.image
      }));

      res.status(200).json(formatted);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
