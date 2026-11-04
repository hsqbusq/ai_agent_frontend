##########
# 1. Build
##########
FROM node:22 AS build

WORKDIR /app

# 先安装依赖（利用 Docker 层缓存，不用 lock file 避免平台差异）
COPY package.json ./
RUN npm config set registry https://registry.npmmirror.com && npm install

# 复制源码并构建
COPY . .
RUN npm run build

##########
# 2. Serve
##########
FROM nginx:stable-alpine

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG PROXY_TARGET=http://10.219.9.139:8004

# 从 build 阶段复制构建产物
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf.template /tmp/nginx.conf.template

# 生成 nginx 配置
RUN sed "s|\${PROXY_TARGET}|${PROXY_TARGET}|g" /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
