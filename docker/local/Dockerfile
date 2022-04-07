FROM nginx

COPY ./docker/local/nginx.conf /etc/nginx/nginx.conf
# Assumes that fluent bitbucket code has been cloned in bitbucket directory.
COPY ./dist/disruption-messaging/ /var/www/angular-deploy
