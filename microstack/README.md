# MicroStack

MicroStack is a complete, production-ready, fully dockerized microservice architecture starter kit.

## Architecture

```
[Client] -> [Gateway (Nginx)]
                 |
    +------------+------------+
    |            |            |
[Auth Service] [File Service] [Notification Service]
    |            |            |
[Postgres]    [Local FS]    [Redis] -> [Nodemailer]
```

## Services

1.  **Gateway**: Nginx reverse proxy routing traffic to services.
2.  **Auth Service**: Node.js + Express + Prisma + Postgres + JWT. Handles user registration and authentication.
3.  **File Service**: Node.js + Express + Multer. Handles file uploads and retrieval.
4.  **Notification Service**: Node.js + Redis Pub/Sub + Nodemailer. Handles asynchronous email notifications.
5.  **Shared Libraries**: Common utilities for JWT and HTTP responses.

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### Running the Project

1.  Clone the repository.
2.  Navigate to the `microstack` directory.
3.  Run the following command:

```bash
docker compose up --build
```

The services will be available at `http://localhost`.

### Verification

Run the verification script to test all services:

```bash
cd microstack
./verify.sh
```

## API Endpoints

### Auth Service
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login and receive a JWT.
- `GET /auth/me`: Get current user profile (Protected).

### File Service
- `POST /file/upload`: Upload a file (Protected).
- `GET /file/:id`: Get a file by ID.

### Notification Service
- `POST /notify/email`: Queue an email notification.

## Configuration

Environment variables are defined in `docker-compose.yml`. You can also use a `.env` file based on `.env.example`.

### SMTP Configuration
To configure real email sending, update the `SMTP_*` environment variables in `docker-compose.yml` or `.env`.

### S3 Storage
To switch to S3, modify `microstack/file-service/src/services/storage.service.js` to use `multer-s3`.

## Troubleshooting

- **Database Connection**: Ensure Postgres is ready before services start. The `depends_on` condition in `docker-compose.yml` handles this.
- **Redis Connection**: Ensure Redis is running.
- **Ports**: Check if ports 80, 4001, 4002, 4003, 5432, 6379 are available.

## Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push to the branch.
5.  Create a Pull Request.
