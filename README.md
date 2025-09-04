# 🏫 School Management App (Next.js + MySQL + Cloudinary)

This is a simple **Next.js** project using the **Pages Router**, with **MySQL** for database storage and **Cloudinary** for image uploads.
It supports:

* ➕ Adding new schools (form with image upload)
* 📜 Viewing a list of schools (with stored Cloudinary images)
* 💾 MySQL database integration
* ☁️ Cloudinary for image hosting
* 🎨 Tailwind CSS for styling

---

## 🚀 Features

* **Frontend pages**:

  * `/addSchool` → Add a new school (form with file upload)
  * `/showSchools` → Display stored schools with images
* **Backend API routes**:

  * `POST /api/schools` → Insert new school details + upload image to Cloudinary
  * `GET /api/schools` → Fetch list of schools from MySQL
* **Form validation** with `react-hook-form`
* **File upload handling** with `formidable`

---

## ⚙️ Installation

1. Clone this repository:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup Tailwind CSS (already configured in this repo).

---

## 🗄️ Database Setup (MySQL)

Create a `schools` table in your MySQL database:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  contact BIGINT,
  email_id TEXT NOT NULL,
  image TEXT,
  image_id TEXT
);
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of your project:

```env
# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=schooldb

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ Without this file, the app **will not run**.

---

## ▶️ Running the App

### Development

```bash
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

---

## 📂 Folder Structure (Important parts)

```
src/
├── pages/
│   ├── addSchool.tsx        # Add school form (frontend)
│   ├── showSchools.tsx      # Display schools (frontend)
│   ├── api/
│   │   └── schools.ts       # GET + POST API
├── lib/
│   ├── db.ts                # MySQL connection
│   └── cloudinary.ts        # Cloudinary setup
├── styles/
│   └── globals.css          # Tailwind styles
```

---

## 📌 Notes

* Vercel deployments cannot store files locally, so **Cloudinary is required** for images.
* Ensure `.env` is present in both **local dev** and **deployed environments**.
* `formidable` is used to handle file uploads in the Next.js API route.
