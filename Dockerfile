FROM nginx

COPY dist/homeverse-fe/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]