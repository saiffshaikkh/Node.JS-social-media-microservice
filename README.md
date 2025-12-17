# Social Media-Microservices App

A production-ready Social Media backend application built with **Microservices** architecture. It leverages Node.js, Express, MongoDB, Redis, and RabbitMQ to provide a scalable, event-driven system for user management, posting, media handling, and search.

## 🌟 Features

### 🔐 authentication & Identity

- **JWT-based Authentication**: Secure user sessions with access and refresh tokens.
- **Identity Service**: Dedicated microservice for user lifecycle management.
- **Secure Password Handling**: Bcrypt hashing for password storage.
- **Rate Limiting**: Protection against abuse at the gateway level.

### 📝 Post Management

- **CRUD Operations**: Complete lifecycle for social media posts.
- **Event-Driven**: Asynchronous communication with other services via RabbitMQ (e.g., triggering search indexing).
- **Scalable**: Independent scaling for high-traffic posting activity.

### 📸 Media Handling

- **Cloudinary Integration**: Seamless image/file uploads and management.
- **Optimized Storage**: Media processing and optimization handled externally.
- **Secure Uploads**: Validated file types and size limits.

### 🔍 Search

- **Dedicated Search Service**: Indexed content for fast retrieval.
- **Real-time Indexing**: Posts are indexed as they are created via message queues.
- **Redis Caching**: High-performance caching for frequent search queries.

### 🏗 Architecture & Infrastructure

- **API Gateway**: Single entry point handling routing, auth proxying, and request aggregation.
- **Message Broker**: RabbitMQ for decoupled, reliable inter-service communication.
- **Distributed Caching**: Redis for session storage, rate limiting, and data caching.
- **Containerization**: Fully Dockerized for consistent development and deployment environments.

## 🛠 Prerequisites

- **Docker** and **Docker Compose** (Essential for running the stack)
- **Node.js 18+** (If running services locally without Docker)
- **MongoDB Atlas** or Local MongoDB (If not using Dockerized Mongo)
- **Cloudinary Account** (For Media Service)

# 🚀 Quick Start (5 Minutes)

The fastest way to get up and running is with Docker Compose.

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd social-media-microservice
    ```

2.  **Environment Setup**
    You must create `.env` files for each service.

    ```bash
    # Copy env examples (manual step per service)
    cp api-gateway/.env.example api-gateway/.env
    cp identity-service/.env.example identity-service/.env
    # ... repeat for all services
    ```

    _See [Configuration](#-configuration) below for details._

3.  **Start the Application**

    ```bash
    docker-compose up --build
    ```

4.  **Verify Status**
    The API Gateway will be available at: `http://localhost:3000`

## ⚙ Configuration

Each service requires specific environment variables. Create a `.env` file in each of the following directories:

### API Gateway (`api-gateway/.env`)

```env
PORT=3000
NODE_ENV=development
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_should_match_identity_service
# Service Discovery
IDENTITY_SERVICE_URL=http://identity-service:3001
POST_SERVICE_URL=http://post-service:3002
MEDIA_SERVICE_URL=http://media-service:3003
SEARCH_SERVICE_URL=http://search-service:3004
```

### Identity Service (`identity-service/.env`)

```env
PORT=3001
NODE_ENV=development
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/identity-db
JWT_SECRET=your_jwt_secret_should_match_gateway
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
```

### Post Service (`post-service/.env`)

```env
PORT=3002
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/post-db
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
```

### Media Service (`media-service/.env`)

```env
PORT=3003
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/media-db
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
# Cloudinary Credentials
cloud_name=your_cloud_name
api_key=your_api_key
api_secret=your_api_secret
```

### Search Service (`search-service/.env`)

```env
PORT=3004
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/search-db
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://rabbitmq:5672
```

## 📡 API Endpoints

All requests go through the API Gateway at `http://localhost:3000`.

### Authentication

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| POST   | `/v1/auth/register`      | Create a new user account           |
| POST   | `/v1/auth/login`         | Login and receive `accessToken`     |
| POST   | `/v1/auth/refresh-token` | specific endpoint to refresh tokens |
| POST   | `/v1/auth/logout`        | Invalidate user session             |

### Posts (Protected)

_Requires Header: `Authorization: Bearer <token>`_

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | `/v1/posts/create-post` | Create a new text post  |
| GET    | `/v1/posts/all-posts`   | Retrieve feed of posts  |
| GET    | `/v1/posts/:id`         | Get single post details |
| DELETE | `/v1/posts/:id`         | Delete a post           |

### Media (Protected)

_Requires Header: `Authorization: Bearer <token>`_

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/v1/media/upload` | Upload file (Key: `file`) |
| GET    | `/v1/media/get`    | List uploaded media files |

### Search (Protected)

_Requires Header: `Authorization: Bearer <token>`_

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/v1/search/posts` | Search posts by keyword |

## 📁 Project Structure

```bash
social-media-microservice/
├── api-gateway/            # Entry point, routing, auth proxy
├── identity-service/       # Auth & User management
├── media-service/          # File handling & Cloudinary
├── post-service/           # Core content logic
├── search-service/         # Search indexing & retrieval
├── docker-compose.yml      # Orchestration config
└── README.md              # Documentation
```

## ❓ Troubleshooting

### Connection Refused (Redis/RabbitMQ)

- **Problem**: Services crash on startup with connection errors.
- **Solution**: Ensure `redis` and `rabbitmq` containers are healthy. Docker Compose `depends_on` handles start order, but services may need a moment to be ready. Restarting usually fixes this: `docker-compose restart <service-name>`.

### Media Upload Fails

- **Problem**: Uploads hanging or erroring.
- **Solution**: Check your `Cloudinary` credentials in `media-service/.env`. Ensure the file size is under the configured limit (default 5MB).

### Service Not Found

- **Problem**: API Gateway returns 404 or 502.
- **Solution**: Verify the `_SERVICE_URL` variables in `api-gateway/.env` match the Docker service names (e.g., `http://identity-service:3001`).

## 🤝 Contributing

Contributions are welcome!

## 📄 License

This project is licensed under the MIT License.
