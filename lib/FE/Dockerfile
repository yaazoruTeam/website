# Simple nginx-based Dockerfile for serving built React frontend
FROM nginx:alpine

# Copy built assets (dist folder should be created locally first)
COPY dist /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]