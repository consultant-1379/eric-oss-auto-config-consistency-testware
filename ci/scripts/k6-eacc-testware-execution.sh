#!/bin/bash
#
# COPYRIGHT Ericsson 2023
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

# Docker images used
KUBE_DOCKER_IMAGE="armdocker.rnd.ericsson.se/proj-adp-cicd-drop/bob-py3kubehelmbuilder:latest"
K6_CLI_IMAGE="armdocker.rnd.ericsson.se/proj-eric-oss-dev-test/k6-reporting-tool-cli:latest"

# The id user & group
ID_U=`id -u`
ID_G=`id -g`

# The kubectl & helm docker images
KUBECTL="docker run --init --rm --volume ${PWD}:${PWD} --volume ${KUBECONFIG}:/.kube/config --env KUBECONFIG=/.kube/config ${KUBE_DOCKER_IMAGE} kubectl"
HELM="docker run --init --rm --user ${ID_U}:${ID_G} --volume ${HOME}:${HOME} --volume ${PWD}:${PWD} --volume ${KUBECONFIG}:/.kube/config --env KUBECONFIG=/.kube/config ${KUBE_DOCKER_IMAGE} helm"


if [[ -z "$EACC_DEPLOYMENT" ]]; then
  EACC_DEPLOYMENT="eric-oss-auto-config-consistency"
fi

if [[ -z "$EPME_PREFIX" ]]; then
  EACC_PREFIX="/eacc"
fi

function getTestwareImageVersion() {
  url="${DOCKER_TESTWARE_PATH}?list&deep=1&listFolders=1&mdTimestamps=1"
  response=$(curl -u ${FUNCTIONAL_USER_USERNAME}:${FUNCTIONAL_USER_PASSWORD} -s "${url}")
  if [ $? -ne 0 ]; then
        echo "Error fetching image tags from Artifactory"
        exit 1
  fi
  tags=$(echo "${response}" | jq -r '.files[] | select(.folder == true) | .uri | ltrimstr("/")')
  versions=$(echo "${tags}" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V)
  latest_version=$(echo "${versions}" | tail -n 1)
  echo "${latest_version}"
}

TESTWARE_REPO="${EACC_TESTWARE_NAME}"
TESTWARE_PATH="https://arm.seli.gic.ericsson.se/artifactory/proj-eric-oss-ci-drop-testware-helm-local"
DOCKER_TESTWARE_PATH="https://arm.seli.gic.ericsson.se/artifactory/api/storage/proj-eric-oss-drop-docker-global/proj-eric-oss-drop/${TESTWARE_REPO}"
TESTWARE_IMAGE_VERSION=$(getTestwareImageVersion)
HELM_EACC_ENV="env.OPTIONS_FILE=${OPTIONS_FILE},env.BUILD_URL=${BUILD_URL},env.PRODUCT_VERSION=${CHART_VERSION},env.GAS_URL=${GAS_URL},env.INGRESS_SCHEMA=${INGRESS_SCHEMA},env.INGRESS_HOST=${INGRESS_HOST},env.INGRESS_LOGIN_USER=${INGRESS_LOGIN_USER},env.INGRESS_LOGIN_PASSWORD=${INGRESS_LOGIN_PASSWORD},env.RESTSIM_HOST=${RESTSIM_HOST},env.APP_VERSION=${CHART_VERSION},env.PRODUCT=${EACC_DEPLOYMENT},env.ENVIRONMENT=${ENVIRONMENT}"
if [[ "$OPTIONS_FILE" == "/resources/config/postInstantiation.options.json" ]]; then
  HELM_EACC_ENV="${HELM_EACC_ENV},env.VALIDATE_EACC_RBAC=${VALIDATE_EACC_RBAC}"
fi
RELEASE_NAME="${EACC_TESTWARE_NAME}"

function installK6DevSecrets() {
  echo "# Installing K6 development secrets"
  ${KUBECTL} apply -f ${PWD}/ci/testware/secrets/testware-resources-secret.yaml --namespace ${NAMESPACE}
}

echo "#####################################################################"
echo "# Creating kubeconfig"

echo "# Copying ${KUBECONFIG_FILE_PATH}"
cp ${KUBECONFIG_FILE_PATH} ${PWD}/kubeconfig
chmod -f 777 ${PWD}/kubeconfig | true

chmod -f 777 ${PWD}/.helm/repositories.yaml | true
chmod -f 777 ${PWD}/.helm/repositories.lock | true

echo "#####################################################################"
echo "# Getting testware secrets"

echo "# INSTALL_PRODUCT_STAGING_DEV_SECRETS: ${INSTALL_K6_DEV_SECRETS}"

if [[ "$INSTALL_K6_DEV_SECRETS" == "true" ]]; then
  installK6DevSecrets
else
  echo "# Installing K6 product secrets"
  ${KUBECTL} apply -f ${PWD}/ci/secrets/product-staging-resources-secret.yaml --namespace ${NAMESPACE}
fi

# Due to issue with Jenkins including colour characters into variables temp file is required
K6_TMP_DIR="${PWD}/.k6-tmp/"
K6_TMP_FILE="${K6_TMP_DIR}/file.txt"
rm -rf ${K6_TMP_DIR} || true
mkdir -p ${K6_TMP_DIR}

RPT_API_URL_BASE_64=$($KUBECTL get secrets/testware-resources-secret --template={{.data.api_url}} --namespace $NAMESPACE)
echo ${RPT_API_URL_BASE_64} > ${K6_TMP_FILE}
RPT_API_URL=$(cat -A $K6_TMP_FILE | base64 -di)
echo "# RPT_API_URL: ${RPT_API_URL}"

RPT_GUI_URL_BASE_64=$($KUBECTL get secrets/testware-resources-secret --template={{.data.gui_url}} --namespace $NAMESPACE)
echo ${RPT_GUI_URL_BASE_64} > ${K6_TMP_FILE}
RPT_GUI_URL=$(cat -A $K6_TMP_FILE | base64 -di)
echo "# RPT_GUI_URL: ${RPT_GUI_URL}"

TESTWARE_CLI="docker run --rm -t -e RPT_API_URL=${RPT_API_URL} -e RPT_GUI_URL=${RPT_GUI_URL} -v ${PWD}:${PWD} --user ${ID_U}:${ID_G} ${K6_CLI_IMAGE} testware-cli"

echo "#####################################################################"
echo "# Creating a K6 Job for ${BUILD_URL}"

${TESTWARE_CLI} create-job --jenkins-url ${BUILD_URL} --testware-count 1 --timeout 3900

echo "#####################################################################"
echo "# Preparing for Helm install"
echo "# K6 ENV: ${HELM_EACC_ENV}"

echo "# deploy eric-oss-auto-config-consistency-testware"

echo "# helm repo remove"
${HELM} repo remove ${TESTWARE_REPO} --repository-cache ${PWD}/.helm/cache --repository-config ${PWD}/.helm/repositories.yaml
echo "# helm repo add"
${HELM} repo add ${TESTWARE_REPO} ${TESTWARE_PATH} --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD} --repository-cache ${PWD}/.helm/cache --repository-config ${PWD}/.helm/repositories.yaml
echo "#helm repo update"
${HELM} repo update ${TESTWARE_REPO} --repository-cache ${PWD}/.helm/cache --repository-config ${PWD}/.helm/repositories.yaml
echo "# helm repo install"
${HELM} install ${EACC_TESTWARE_NAME} ${TESTWARE_REPO}/${EACC_TESTWARE_NAME} --version ${TESTWARE_IMAGE_VERSION} --namespace ${NAMESPACE} --set ${HELM_EACC_ENV} --repository-cache ${PWD}/.helm/cache --repository-config ${PWD}/.helm/repositories.yaml

EXIT_STATUS=$?
if [ $EXIT_STATUS -ne 0 ]; then
    echo "# Helm install failed!"
    echo "# Command: ${HELM} install ${EACC_TESTWARE_NAME} ${TESTWARE_REPO}/${EACC_TESTWARE_NAME} --version ${TESTWARE_IMAGE_VERSION} --namespace ${NAMESPACE} --set ${HELM_EACC_ENV}"
    exit 1
fi


echo "#####################################################################"
echo "# Monitoring K6 tests"

${TESTWARE_CLI} wait-testware --url ${BUILD_URL} --path ${PWD} --delay 20 --retries 300 || true
echo "# ${TESTWARE_CLI}"

# Finished at this point, print complete status
FINISHED_STATUS=$($TESTWARE_CLI get-status --url ${BUILD_URL} --path ${PWD})
echo "# ${FINISHED_STATUS}"

TESTWARE_ID_CMD=$($TESTWARE_CLI get-status --url ${BUILD_URL} --path ${PWD} | grep id\: | awk -F: '{print $2}' | tr -d '[:space:]')
echo ${TESTWARE_ID_CMD} > ${K6_TMP_FILE}
TESTWARE_ID=$(cat -A $K6_TMP_FILE | sed -r 's/\^\[\[[[:digit:]]+[[:alpha:]]//g' | sed -r 's/\$//g')
echo "# TESTWARE_ID: ${TESTWARE_ID}"

TESTWARE_ID_CMD=$($TESTWARE_CLI get-status --url ${BUILD_URL} --path ${PWD} | grep passed\: | awk -F: '{print $2}' | tr -d '[:space:]')
echo ${TESTWARE_ID_CMD} > ${K6_TMP_FILE}
TEST_SUCCESS=$(cat -A $K6_TMP_FILE | sed -r 's/\^\[\[[[:digit:]]+[[:alpha:]]//g' | sed -r 's/\$//g')
echo "# TEST_SUCCESS: ${TEST_SUCCESS}"

if [[ -z "$TEST_SUCCESS" ]]; then
  TEST_SUCCESS="False"
fi

echo "#####################################################################"
echo "# Fetching K6 logs"

${TESTWARE_CLI} list-logs --id ${TESTWARE_ID}
${TESTWARE_CLI} download-log --id ${TESTWARE_ID} --type k6 --path ${PWD}/doc/Test_Report

echo "#####################################################################"
echo "# Preparing for Helm uninstall"

echo "# helm repo uninstall"
${HELM} uninstall ${RELEASE_NAME} --namespace ${NAMESPACE}

echo "#####################################################################"

# Remove the temp k6 folder
rm -rf ${K6_TMP_DIR} || true

if [[ "$TEST_SUCCESS" == "False" ]]; then
  echo "# K6 Test failed!"
  exit 1;
else
  echo "# K6 Tests passed!"
  exit 0;
fi
