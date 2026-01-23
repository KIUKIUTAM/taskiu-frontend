# ============================================
# 階段 1: 構建階段 (Build Stage)
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

# 📦 複製 Yarn 鎖定檔案
COPY package.json yarn.lock ./

# 🔧 使用 Yarn 安裝依賴
RUN yarn install --frozen-lockfile --production=false --silent

COPY . .

ARG REACT_APP_API_URL=http://localhost:8088/api
ARG REACT_APP_ENV=production
ARG BUILD_NUMBER=unknown
ARG GIT_COMMIT=unknown

ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_ENV=${REACT_APP_ENV}
ENV REACT_APP_BUILD_NUMBER=${BUILD_NUMBER}
ENV REACT_APP_GIT_COMMIT=${GIT_COMMIT}

RUN yarn build

# ============================================
# 階段 2: 生產階段 (Production Stage)
# ============================================
FROM nginx:1.25-alpine AS production

RUN apk add --no-cache curl bash tzdata && rm -rf /var/cache/apk/*

ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

ARG BUILD_NUMBER=unknown
ARG GIT_COMMIT=unknown
ARG BUILD_DATE=unknown

RUN cat > /usr/share/nginx/html/version.json <<EOF
{
  "service": "frontend",
  "build": "${BUILD_NUMBER}",
  "commit": "${GIT_COMMIT}",
  "date": "${BUILD_DATE}",
  "version": "1.0.0"
}
EOF

RUN echo '#!/bin/sh' > /usr/local/bin/health-check.sh && \
    echo 'curl -f http://localhost/ > /dev/null 2>&1 || exit 1' >> /usr/local/bin/health-check.sh && \
    chmod +x /usr/local/bin/health-check.sh

RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD /usr/local/bin/health-check.sh

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
