# ============================
# Bước 1: Build Stage
# ============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json trước để tận dụng cache tốt hơn
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build project
RUN npm run build

# ============================
# Bước 2: Run Stage
# ============================
FROM node:18-alpine

WORKDIR /app

# Chỉ copy thư mục cần thiết từ "builder"
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Đặt biến môi trường
ENV NODE_ENV=production

# Expose cổng ứng dụng
EXPOSE 3000

# Lệnh khởi chạy service
CMD ["npm", "run", "start:prod"]
