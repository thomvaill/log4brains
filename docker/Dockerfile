FROM node:14.18-alpine3.14

ARG LOG4BRAINS_VERSION

USER node
WORKDIR /workdir
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install -g log4brains@${LOG4BRAINS_VERSION}

EXPOSE 4004
ENTRYPOINT [ "log4brains" ]
