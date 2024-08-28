FROM armdocker.rnd.ericsson.se/proj-eric-oss-drop/k6-base-image:latest

ARG version

#K6 VARIABLES

# The application under test. This should be immutable
ENV APP_NAME=$name
# This should match the version of the image being published in the repository.
# Do not use "latest" as testware version
ENV APP_VERSION=$version
ENV TESTWARE_NAME=$name
ENV TEST_VERSION=$version
ENV PRODUCT="eric-oss-auto-config-consistency"
ENV PRODUCT_VERSION=""
# Defines the staging type on which the container will run
# The default value here is APPLICATION, but if the test is reused in a different loop the env var
# should be set with the new value at runtime
ENV STAGING_TYPE="PRODUCT"
# The Options file to use designating the test cases to run
ENV OPTIONS_FILE=""
# This can be used to delay the container "disposal" after the testware completion
# Can be used to give time to collect resources from the container for example.
ENV SHUTDOWN_WAIT_TIME=0

ENV ADDITIONAL_ARGS="--insecure-skip-tls-verify --quiet --http-debug=full --verbose"
ENV DATABASE_URL=""
ENV K6_TOOL_GUI_URL=""
ENV API_URL=""

#EACC VARIABLES
ENV VALIDATE_EACC_RBAC=""
ENV EACC_PREFIX=""
ENV INGRESS_SCHEMA=""
ENV INGRESS_HOST=""
ENV INGRESS_LOGIN_USER=""
ENV INGRESS_LOGIN_PASSWORD=""


ADD js/ /tests
ADD resources/ /resources