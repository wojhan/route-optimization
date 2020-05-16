# pull official base image
FROM python:3.6

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y gcc

# install psycopg2 dependencies
#RUN apk update \
#    && apk add postgresql-dev gcc python3-dev musl-dev libffi-dev libc6-compat

#RUN touch /usr/local/lib/python3.6/_manylinux.py
#
#RUN echo 'manylinux1_compatible = True' > /usr/local/lib/python3.6/_manylinux.py
#

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

#RUN touch /usr/local/lib/python3.6/_manylinux.py

#RUN echo 'manylinux1_compatible = True' > /usr/local/lib/python3.6/_manylinux.py

#RUN pip install ray


# copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# copy project
COPY . /usr/src/app/

# run entrypoint.sh
#ENTRYPOINT ["/usr/src/app/entrypoint.sh"]