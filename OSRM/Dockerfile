FROM cartography/osrm-backend-docker:latest

# OSM data, update this in the docker compose file
ARG PBF
RUN curl $PBF > /osrm-data/hugedata.osm.pbf

ARG STXXL_SIZE
RUN echo "disk=/tmp/stxxl,$STXXL_SIZE,syscall" > .stxxl

# Prepare the OSM data
RUN ./osrm-extract /osrm-data/hugedata.osm.pbf
RUN ./osrm-contract /osrm-data/hugedata.osrm

# Run the server
RUN echo "/osrm-build/osrm-routed /osrm-data/hugedata.osrm --max-table-size 8000" > /runserver.sh
RUN chmod +x /runserver.sh
ENTRYPOINT /runserver.sh