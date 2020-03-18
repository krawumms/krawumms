#!/bin/bash

set -e

function null_to_empty_string() {
    if [[ "$1" == "null" ]]; then
        echo ""
    else
        echo "$1"
    fi
}

function export_var() {
    echo "::set-env name=$1::${!1}"
}

GITHUB_EVENT_NAME="$( echo "$GITHUB_CONTEXT" | jq -cr '.event_name' )"
GITHUB_EVENT_ACTION="$(null_to_empty_string "$( echo "$GITHUB_CONTEXT" | jq -cr '.event.action' )")"

# echo "GITHUB_EVENT_NAME=$GITHUB_EVENT_NAME"
# echo "GITHUB_EVENT_ACTION=$GITHUB_EVENT_ACTION"

if [[ "$GITHUB_EVENT_NAME" == "pull_request" ]]; then
    if [[ "$GITHUB_EVENT_ACTION" == "rerequested" ]]; then
        GITHUB_SECOND_PR_NUMBER="$(null_to_empty_string "$( echo "$GITHUB_CONTEXT" | jq -cr '.event.check_suite.pull_requests[1].number' )")"

        if [[ "$GITHUB_SECOND_PR_NUMBER" != "" ]]; then
            echo "Got two PRs in github.event.check_suite.pull_requests"
            echo "$GITHUB_CONTEXT"
            exit 1
        fi
    
        # BASEREF_SHA_FULL="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.check_suite.pull_requests[0].base.sha' )"
        # BASEREF_SHA="${BASEREF_SHA_FULL:0:7}"
        BASEREF_NAME="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.check_suite.pull_requests[0].base.ref' )"
        HEADREF_SHA_FULL="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.check_suite.pull_requests[0].head.sha' )"
        HEADREF_SHA="${HEADREF_SHA_FULL:0:7}"
        HEADREF_NAME="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.check_suite.pull_requests[0].head.ref' )"
        PR_NUMBER="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.check_suite.pull_requests[0].number' )"
    elif [[ "$GITHUB_EVENT_ACTION" == "synchronize" || "$GITHUB_EVENT_ACTION" == "opened" ]]; then
        # BASEREF_SHA_FULL="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.pull_request.base.sha' )"
        # BASEREF_SHA="${BASEREF_SHA_FULL:0:7}"
        BASEREF_NAME="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.pull_request.base.ref' )"
        HEADREF_SHA_FULL="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.pull_request.head.sha' )"
        HEADREF_SHA="${HEADREF_SHA_FULL:0:7}"
        HEADREF_NAME="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.pull_request.head.ref' )"
        PR_NUMBER="$( echo "$GITHUB_CONTEXT" | jq -cr '.event.pull_request.number' )"
    else
        echo "Unknown event action $GITHUB_EVENT_ACTION"
        exit 1
    fi

    TAG_BASE="pr_$PR_NUMBER"
    TAG="${TAG_BASE}_$HEADREF_SHA"
    BUILD_TAG="build_$TAG_BASE"
    # the SECONDARY_BUILD_TAG is used as an additional docker cache source as PRs might share quite some things with their base branch
    SECONDARY_BUILD_TAG="build_$BASEREF_NAME"

    CODECOV_BRANCH="$HEADREF_NAME"
    CODECOV_COMMIT="$HEADREF_SHA_FULL"
    
    echo "Building PR with TAG ${TAG} (BUILD_TAG=$BUILD_TAG)"
elif [[ "$GITHUB_EVENT_NAME" == "push" ]]; then
    SHA_FULL="$( echo "$GITHUB_CONTEXT" | jq -cr '.sha' )"
    HEADREF_SHA_FULL="$SHA_FULL"
    SHA="${SHA_FULL:0:7}"

    TAG_BASE="$( echo "$GITHUB_CONTEXT" | jq -cr '.ref' | sed "s|refs/heads/||")"
    TAG="${TAG_BASE}_$SHA"
    BUILD_TAG="build_$TAG_BASE"
    # use the same SECONDARY_BUILD_TAG as BUILD_TAG for branches as we can not use the cache of a base branch
    SECONDARY_BUILD_TAG="$BUILD_TAG"

    CODECOV_BRANCH="$TAG_BASE"
    CODECOV_COMMIT="$SHA_FULL"
    
    echo "Building branch with TAG ${TAG} (BUILD_TAG=$BUILD_TAG)"
else
    echo "Unknown github event: $GITHUB_EVENT_NAME"
    exit 1
fi

CODECOV_PR_ARG=
if [[ "$PR_NUMBER" != "" ]]; then
    CODECOV_PR_ARG="-P $PR_NUMBER"
fi

# export_var BASEREF_SHA_FULL
# export_var BASEREF_SHA
# export_var BASEREF_NAME
export_var HEADREF_SHA_FULL
# export_var HEADREF_SHA
# export_var HEADREF_NAME
export_var PR_NUMBER
export_var TAG_BASE
export_var TAG
export_var BUILD_TAG
export_var SECONDARY_BUILD_TAG
export_var CODECOV_BRANCH
export_var CODECOV_COMMIT
export_var CODECOV_PR_ARG
