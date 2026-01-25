# Hệ thống Học tập Education Technology

## Giới thiệu

Hệ thống học tập trực tuyến thông minh

## Tech Stack
- **Framework:** React  
- **CSS framework:** TailwindCSS  
- **Bundler / Dev server:** Vite  
- **Language:** TypeScript  
- **Local Environment:** Docker  

## Cấu trúc thư mục

``` bash
src/
├─ assets/                # hình ảnh, fonts, static assets
├─ components/            # các component chung
│  ├─ layout/             # layout chung (Navbar, Footer, ...)
│  ├─ ui/                 # các component tái sử dụng (Input, Button, ...)
├─ hooks/
├─ pages/
├─ routes/                # định nghĩa routes ứng dụng
├─ services/              # axios instance
├─ store/
├─ utils/
│  └─ constants.ts        # hằng số dự án
└─ index.css
└─ App.tsx
└─ main.tsx
```

## Chạy bằng Docker

### 1. Clone repo

``` bash
git clone https://github.com/dtduc-ptit/edtech_frontend.git
cd edtech_frontend
```

### 2. Cấu hình `.env`

```bash
cp .env.example .env
```

### 3. Chạy Docker Compose

``` bash
docker-compose up --build
```

-   Frontend chạy tại: <http://localhost:5173>

### 4. Dừng containers

``` bash
docker-compose down
```

## Development (không dùng Docker)

``` bash
npm install
npm run dev
```


#Deploy to production

## client
```bash
docker build -t nguyenduc1603/edtech-fe:1.0.x .
docker push nguyenduc1603/edtech-fe:1.0.x
```

### Sửa dòng image trong docker-compose.yml với tag vừa push

## server
```bash
docker-compose pull
docker-compose up -d
```# Edtech-FE
