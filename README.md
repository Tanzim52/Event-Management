# 📅 Event Management Web Application

![Event Management UI](https://i.ibb.co/SHfrpx0/Screenshot-2025-07-01-234227.png)

A fully functional **Event Management System** built with the **MERN stack**. The platform supports custom authentication, dynamic event operations, search and filter features, and a responsive, user-friendly UI.

---

## 🚀 Features

### 🔐 Authentication
- Custom-built **Registration & Login** system (no third-party auth libraries).
- Validations with meaningful error messages.
- Auth-protected routes for managing personal events.

### 🏠 Homepage
- Custom-designed homepage for branding and user experience.

### 📋 Events Page *(Private Route)*
- Display all events in **descending order** by date and time.
- Search by **event title**.
- **Filter** events by:
  - Today
  - Current/Last Week
  - Current/Last Month
- Each event card displays:
  - Event Title
  - Name (poster)
  - Date and Time
  - Location
  - Description
  - Attendee Count
  - **Join Event** button (only once per user)

### ➕ Add Event *(Private Route)*
- Form to submit new events with:
  - Title, Poster Name, Date & Time, Location, Description
  - Default Attendee Count set to 0
- Stores data directly to MongoDB

### 📁 My Events *(Private Route)*
- View only **your added events**
- Each event card includes:
  - Update Button (form or modal)
  - Delete Button (with confirmation)

---

## 🧑‍💻 Tech Stack

| Tech        | Usage                        |
|-------------|------------------------------|
| **Frontend**| React.js, Tailwind CSS, React Router |
| **Backend** | Node.js, Express.js          |
| **Database**| MongoDB Atlas                |
| **Auth**    | Custom auth (no Firebase/Auth0) |
| **Tools**   | Vite, Axios, Git, Postman, Render/Netlify |

---

## 🗂️ Folder Structure

project-root/
│
├── client/ # React Frontend
│ └── src/
│ ├── pages/
│ ├── components/
│ └── routes/
│
├── server/ # Express Backend
│ ├── routes/
│ ├── controllers/
│ └── index.js

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### 📌 Prerequisites
- Node.js & npm installed
- MongoDB Atlas URI
- Vite installed globally (optional)

---

### 🔧 Installation

#### 1. Clone the Repo

```bash
git clone https://github.com/your-username/event-management-app.git
cd event-management-app
2. Setup Server
bash
Copy
Edit
cd server
npm install
# Create a .env file with your Mongo URI and JWT Secret
npm run dev
3. Setup Client
bash
Copy
Edit
cd client
npm install
npm run dev
```
## 📸 Screenshots

### 🏠 Homepage
![Homepage](https://i.ibb.co/SHfrpx0/Screenshot-2025-07-01-234227.png)

### 📋 Events Page with Filtering
![Events Filtering](https://i.ibb.co/LdkFvgMC/Screenshot-2025-07-01-234722.png)

### 🧾 Add New Event Form
![Search](https://i.ibb.co/LXCq5nyJ/Screenshot-2025-07-01-234735.png)

### 🧾 My Events Dashboard
![Add Event](https://i.ibb.co/wZz8SCrr/Screenshot-2025-07-01-234750.png)

### 👤 More Home
![My Events](https://i.ibb.co/5CzwdMT/Screenshot-2025-07-01-234821.png)

### ✏️ Footer
![Update/Delete](https://i.ibb.co/20GBPBxd/Screenshot-2025-07-01-234844.png)

### 🔐 Filter
![Login](https://i.ibb.co/WWPNCL0c/Screenshot-2025-07-01-234921.png)

### 🔐 Details
![Register](https://i.ibb.co/KcGdwcZq/Screenshot-2025-07-01-235107.png)

🤝 Contributions
This project was built as part of an assessment task. However, feel free to fork and enhance it further!

🧠 Bonus
No third-party Authentication used, A details page given

Fully responsive for all devices

📬 Contact
📧 Email: mahin1575@gmail.com
🌐 Portfolio: [tanzim-4055a.firebaseapp.com](https://tanzim-4055a.firebaseapp.com/)
🔗 LinkedIn | GitHub

Made with ❤️ by Mahin Jawad Tanzim
