FROM ruby:3.4-alpine

RUN apk add --no-cache build-base git && gem install --no-document gollum webrick

WORKDIR /wiki

EXPOSE 4567

CMD ["sh", "-lc", "gollum /wiki/content --host 0.0.0.0 --port 4567"]
