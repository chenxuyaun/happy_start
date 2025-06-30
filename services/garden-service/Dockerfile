# 构建阶段
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 安装git和ca-certificates
RUN apk add --no-cache git ca-certificates tzdata

# 复制go mod和sum文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o main ./cmd/main.go

# 运行阶段
FROM scratch

# 复制时区数据
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# 复制CA证书
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# 复制二进制文件
COPY --from=builder /app/main /main

# 创建非root用户
USER 65534:65534

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["/main", "--health-check"]

EXPOSE 8082

ENTRYPOINT ["/main"]
