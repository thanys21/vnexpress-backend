# VnExpress Backend Deployment Issues & Solutions

## Vấn đề đã phát hiện

1. **Cấu hình Vercel không đúng**: File `vercel.json` thiếu routing cho `/api/*`
2. **CORS thiếu domain**: Chưa có domain frontend chính thức trong CORS
3. **Thiếu biến môi trường**: Backend cần `MONGODB_URI` trên Vercel

## Các thay đổi đã thực hiện

### 1. Sửa `/vercel.json` của backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ],
  "functions": {
    "api/index.js": {
      "includeFiles": "**"
    }
  }
}
```

### 2. Thêm routes kiểm tra trong `app.js`:

```javascript
// Root route
app.get("/", (req, res) => {
  res.json({
    message: "VnExpress Backend API",
    status: "running",
    endpoints: {
      auth: "/api/auth/login",
      users: "/api/users",
      posts: "/api/posts",
    },
  });
});

// Health check
app.get("/api", (req, res) => {
  res.json({
    message: "VnExpress API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});
```

### 3. Cập nhật CORS trong `app.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://vnexpress-chi.vercel.app",
      "https://vnexpress.vercel.app", // Thêm domain chính thức
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## Các bước cần thực hiện để fix

### 1. Trên Vercel Dashboard (Backend):

1. Vào project `vnexpress-backend`
2. Settings → Environment Variables
3. Thêm: `MONGODB_URI` = `your_mongodb_connection_string`
4. Redeploy project

### 2. Test API endpoints:

```bash
# Test root
curl https://vnexpress-backend.vercel.app/

# Test API health
curl https://vnexpress-backend.vercel.app/api

# Test login endpoint
curl -X POST https://vnexpress-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vnexpress.com","password":"123456"}'
```

### 3. Kiểm tra frontend production URL:

Đảm bảo file `.env.production` có:

```
VITE_API_URL=https://vnexpress-backend.vercel.app/api
VITE_USE_MOCK_API=false
```

## Debug Commands

```bash
# Kiểm tra API có hoạt động
curl -I https://vnexpress-backend.vercel.app/api

# Test CORS
curl -H "Origin: https://vnexpress.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://vnexpress-backend.vercel.app/api/auth/login
```
