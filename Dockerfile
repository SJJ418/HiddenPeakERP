FROM nginx:alpine

#COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY Front-End /usr/share/nginx/html
COPY Front-End/welcome.html /usr/share/nginx/html/index.html

EXPOSE 80