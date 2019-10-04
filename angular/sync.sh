#!/bin/bash

ng build
cp dist/routeOptimizer/*.js.map ../django/data/static/
cp dist/routeOptimizer/*.js ../django/data/static/
cp dist/routeOptimizer/index.html ../django/data/templates/index.html
