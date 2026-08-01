FROM node:18-alpine

# Add libc6-compat for Next.js SWC support on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Enable EasyPanel build arguments to be passed as environment variables during build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install

COPY . .

# Disable telemetry and set lower memory limit (1GB) for low-RAM VMs
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NODE_ENV=production

# Since we bypassed eslint/ts, let's just build it
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
