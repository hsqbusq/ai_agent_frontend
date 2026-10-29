FROM node:22 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN rm -rf node_modules && rm -f package-lock.json && npm install
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN apk add --no-cache gettext

# 复制配置模板到安全位置
COPY nginx.conf.template /etc/nginx/templates/

# 确保静态文件权限正确
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY --from=build-stage --chown=nginx:nginx /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["sh", "-c", "envsubst '${PROXY_TARGET}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]


ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
