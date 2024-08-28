#!/bin/bash
#
# COPYRIGHT Ericsson 2023 - 2024
#
#
#
# The copyright to the computer program(s) herein is the property of
#
# Ericsson Inc. The programs may be used and/or copied only with written
#
# permission from Ericsson Inc. or in accordance with the terms and
#
# conditions stipulated in the agreement/contract under which the
#
# program(s) have been supplied.
#

CYPRESS_DOCKER_IMAGE="cypress/included:12.0.0"
CYPRESS_DOCKER_NAME="EACC_rApp_end2end_cypress_$(date +%d-%m-%y_%H-%M-%S)_${BUILD_NUMBER}"

echo "############################################################################"
echo "# Get Cypress Docker version"
docker run --rm $CYPRESS_DOCKER_IMAGE version
echo "############################################################################"

echo "############################################################################"
echo "# Executing Cypress tests..."
echo "#"

BASE_URL="https://${INGRESS_HOST}"
if [[ "$INGRESS_HOST" =~ "http:"  ]]; then
    BASE_URL=${INGRESS_HOST}
fi

EACC_CYPRESS_CONFIG="baseUrl=${BASE_URL}"

# Multiple values must be separated by a comma, not a space
EACC_CYPRESS_ENV="INGRESS_LOGIN_USER=${INGRESS_LOGIN_USER:=eacc-admin},\
INGRESS_LOGIN_PASSWORD=${INGRESS_LOGIN_PASSWORD:=idunEr!css0n},\
BUILD_NUMBER=${BUILD_NUMBER:=1}"

echo "#"
COMMAND="docker run --rm -v ${WORKSPACE}/src/:/src \
-w /src/js/modules/integration/product_staging// \
--name $CYPRESS_DOCKER_NAME \
$CYPRESS_DOCKER_IMAGE \
--config ${EACC_CYPRESS_CONFIG} \
--env ${EACC_CYPRESS_ENV}"

echo "# Command: $COMMAND"
echo "#"
echo "############################################################################"

$COMMAND

exit_status=$?
echo "############################################################################"
echo "# Cypress result code: $exit_status (non-zero means a problem occurred, otherwise successful execution)"
echo "# Process complete"
[ $exit_status -ne 0 ] && { exit 1; }
echo "# SUCCESS"
echo "############################################################################"
exit 0
