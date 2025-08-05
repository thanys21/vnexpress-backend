# VnExpress Backend

Backend API cho VnExpress application sử dụng Node.js, Express và MongoDB.

## Deployment trên Vercel

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### Bước 2: Kết nối với Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import repository từ GitHub: `thanys21/vnexpress-backend`
4. Configure project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (để trống)
   - Output Directory: (để trống)
   - Install Command: npm install

### Bước 3: Cấu hình Environment Variables
Trong Vercel Dashboard, thêm các environment variables:
- `MONGODB_URI`: Connection string MongoDB
- `PORT`: 3001

### API Endpoints
- `GET /api/test` - Test endpoint
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Local Development
```bash
npm install
npm run dev
```

Server sẽ chạy tại http://localhost:3001
