#  MicroStack: A Fully Deployed Microservices Architecture (Auth + File Upload + Notifications)

MicroStack is a **production-style microservices architecture** built using:

- Node.js (Express)
- Docker & Docker Compose
- PostgreSQL + Prisma
- Redis (Upstash)
- Nodemailer (Ethereal)
- Render (Cloud hosting)

This project demonstrates **real-world backend engineering**, including service isolation, inter-service communication, queues, deployments, and environment handling.

---

# 📦 Microservices Included

## 1️⃣ Auth Service  
Handles user identity and authentication.

### Features:
- User registration  
- Login  
- JWT token generation  
- Password hashing (bcryptjs)  
- PostgreSQL + Prisma ORM  

### Live Service URL:
```
https://microstack-auth-service.onrender.com
```

### Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get user profile (requires token) |

---

## 2️⃣ File Service  
Handles file uploads and returns a public URL.

### Features:
- Accepts `multipart/form-data`
- Uses multer for storage  
- Protected via JWT  

### Live Service URL:
```
https://microstack-file-service.onrender.com
```

### Endpoint:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/file/upload` | Upload a file |

---

## 3️⃣ Notification Service  
Handles async email notifications using Redis-based event architecture.

### Features:
- Publishes & subscribes via Redis  
- Sends emails using Nodemailer  
- Ethereal email previews  

### Live Service URL:
```
https://microstack-notification-service.onrender.com
```

### Endpoint:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notify/email` | Send email notification |

---

# 🌐 Deployment Architecture

MicroStack uses **different architectures for local vs cloud environments**.

---

## 🖥️ Local Architecture (Docker + NGINX Gateway)

```
                        ┌────────────┐
Request → NGINX Gateway →  Auth Service
                        ├────────────┤
                        → File Service
                        ├────────────┤
                        → Notification Service
```

Docker Compose spins up:

- Auth Service  
- File Service  
- Notification Service  
- Redis  
- PostgreSQL  
- NGINX API Gateway  

Run locally via:

```bash
docker compose up --build
```

---

## ☁️ Cloud Architecture (Render — Independent Microservices)

Each service is deployed as a **standalone microservice**:

```
Auth Service → Public URL
File Service → Public URL
Notification Service → Public URL
```

This represents true microservice principles:

- Independent deployment  
- Independent logs  
- Independent scaling  

---

# 🧪 API Testing Examples

## 1️⃣ Register
```
POST https://microstack-auth-service.onrender.com/auth/register
{
  "name": "kishlay",
  "email": "test@example.com",
  "password": "pass123"
}
```

## 2️⃣ Login
```
POST https://microstack-auth-service.onrender.com/auth/login
```

Copy the returned token.

## 3️⃣ Get Profile
```
GET https://microstack-auth-service.onrender.com/auth/me
Authorization: Bearer <TOKEN>
```

## 4️⃣ Upload File
```
POST https://microstack-file-service.onrender.com/file/upload
Headers: Authorization: Bearer <TOKEN>
Body: multipart/form-data field "file"
```

## 5️⃣ Send Notification
```
POST https://microstack-notification-service.onrender.com/notify/email
{
  "to": "test@example.com",
  "subject": "Hello",
  "message": "From MicroStack"
}
```

---

# ⚙️ Local Development

## Requirements:
- Docker  
- Node.js (optional if not running inside Docker)  

## Steps:

### Clone the project:
```bash
git clone https://github.com/innovatewithkishlay/MicroStack.git
cd MicroStack/microstack
```

### Start full microservices stack:
```bash
docker compose up --build
```

### Run automated verification:
```bash
bash verify.sh
```

---

# 📁 Project Structure

```
microstack/
│
├── auth-service/
├── file-service/
├── notification-service/
├── gateway/            # Local NGINX Gateway
├── shared/             # Shared utils (JWT etc.)
├── verify.sh           # Automated test script
├── docker-compose.yml
└── README.md
```

---

# 🧠 What This Project Demonstrates

- Microservice isolation  
- API gateways (local only)  
- Cloud deployments without gateway  
- Redis pub/sub communication  
- Prisma migrations & cloud database handling  
- JWT authentication  
- Docker development workflow  

---

# 🚀 Future Improvements
- Add frontend dashboard  
- Add Prometheus + Grafana monitoring  
- Rate limiting with Redis  
- Kubernetes deployment (Helm chart)  
- File storage via AWS S3  

---

# 👤 Author
**Kishlay Kumar**  
Full Stack Developer | Backend Learner | Building in Public  

---

# ⭐ If you find this useful, give the repo a star!

