FROM node:11.4.0-alpine as builder

RUN mkdir /app
WORKDIR /app

# Copy app dependencies.
COPY route-optimizer/package.json route-optimizer/package-lock.json /app/route-optimizer/

# Install app dependencies.
RUN npm install --prefix route-optimizer

# Copy app files.
COPY . /app

# Build app
RUN npm run build --prefix route-optimizer -- --output-path=./dist/out


FROM nginx:1.15.7-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy output directory from builder to nginx image.
COPY --from=builder /app/route-optimizer/dist/out /usr/share/nginx/html

# Copy nginx configuration file.
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf