FROM nginx:alpine

COPY Front-End /usr/share/nginx/html
COPY Front-End/welcome.html /usr/share/nginx/html/index.html

EXPOSE 80