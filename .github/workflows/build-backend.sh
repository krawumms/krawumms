#!/bin/bash
set -e

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
DOCKER_BUILD_DIR="$1"
DOCKER_IMAGE_NAME="$2"
CODECOV_TOKEN="$3"

# Pull docker images from the build stage for caching.
#
# We use $BUILD_TAG for docker images built for this branch/PR
# and $SECONDARY_BUILD_TAG for docker images built for the base branch.
#
# We ignore errors here as we might not have built that image for a branch/PR yet.
$SCRIPTPATH/retry.sh docker pull krawumms/$DOCKER_IMAGE_NAME:$BUILD_TAG || echo "Could not pull docker build cache for TAG ${BUILD_TAG}!"
$SCRIPTPATH/retry.sh docker pull krawumms/$DOCKER_IMAGE_NAME:$SECONDARY_BUILD_TAG || echo "Could not pull docker build cache for TAG ${SECONDARY_BUILD_TAG}!"

# Build the "build" stage of the service, use the cache from the docker images pulled above
time docker build \
    --build-arg IMAGE_PREFIX=krawumms \
    --cache-from krawumms/$DOCKER_IMAGE_NAME:$BUILD_TAG \
    --cache-from krawumms/$DOCKER_IMAGE_NAME:$SECONDARY_BUILD_TAG \
    -t krawumms/$DOCKER_IMAGE_NAME:$BUILD_TAG \
    --target build \
    $DOCKER_BUILD_DIR

# Build the default stage of the service, use the cache from the docker images pulled/built above
time docker build \
    --build-arg IMAGE_PREFIX=krawumms \
    --cache-from krawumms/$DOCKER_IMAGE_NAME:$BUILD_TAG \
    --cache-from krawumms/$DOCKER_IMAGE_NAME:$SECONDARY_BUILD_TAG \
    -t krawumms/$DOCKER_IMAGE_NAME:$TAG \
    $DOCKER_BUILD_DIR

# Push images built from the "build" and default stage above
$SCRIPTPATH/retry.sh docker push krawumms/$DOCKER_IMAGE_NAME:$TAG
$SCRIPTPATH/retry.sh docker push krawumms/$DOCKER_IMAGE_NAME:$BUILD_TAG

# upload coverage reports to codecov
docker run "krawumms/$DOCKER_IMAGE_NAME:$BUILD_TAG" bash -c \
    "bash <(curl -s https://codecov.io/bash) -Z -t \"$CODECOV_TOKEN\" -B $CODECOV_BRANCH -C $CODECOV_COMMIT -k \"$DOCKER_BUILD_DIR\" -X gcov,coveragepy,xcode $CODECOV_PR_ARG -b $TAG -R src -s ../coverage"
