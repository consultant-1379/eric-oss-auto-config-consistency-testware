#!/bin/bash

INGRESS_HOST="gas.stsvp1eic28.stsoss.sero.gic.ericsson.se"
HOSTIP="restsim.stsvp1accd28.stsoss.sero.gic.ericsson.se"
RESET_RESTSIM="false"

# Print the Kubeconfig of the server the chart will be installed on
echo "Using KUBECONFIG -> " $KUBECONFIG

# Change to use proj-eric-oss-dev
echo "# Setting repoPrefix to proj-eric-oss-dev"
sed -i 's|gradle.ext.repoPrefix = "armdocker.rnd.ericsson.se/proj-eric-oss-drop"|gradle.ext.repoPrefix = "armdocker.rnd.ericsson.se/proj-eric-oss-dev"|' settings.gradle

# Set the EACC_PREFIX
USER_ID=$( echo "$(whoami)" | tr '[:upper:]' '[:lower:]' | awk -F'@' '{print $1}'| awk -F'+' '$2 != "" {print $2;next};{print $1}')
EACC_PREFIX="eacc-$USER_ID"
echo "# Setting EACC_PREFIX to '$EACC_PREFIX'"
sed -i "s/^\( *EACC_PREFIX: *\).*/\1\"\/$EACC_PREFIX\"/" deployment/chart/main/values.yaml

# Change testware chart name to include signum
CHART_NAME="eacc-testware-$USER_ID"
echo "# Setting Testware Chart to '$CHART_NAME'"
sed -i "s/'eacc-testware'/'$CHART_NAME'/g" gradle/modules/helm.gradle

optionsFile='preOnboarding.options.json'
productVersion=''                                 # Example: '1.499.0-0'
buildUrl='http://localhost/your-jenkins-job/1'    # Change IF required to be specific
ingressSchema='https'
ingressLoginUser='gas-user'
ingressLoginPassword='idunEr!css0n'

# Set which tests to run
if [[ "$1" = "functional" ]]; then
  RESET_RESTSIM="true"
  echo "# Setting Tests to functional"
  optionsFile='functionalTest.options.json'
elif [[ "$1" = "load" || -z "$1" ]]; then
  RESET_RESTSIM="true"
  echo "# Setting Tests to Load"
  optionsFile='loadTest.options.json'
elif [[ "$1" = "post_char" || -z "$1" ]]; then
  RESET_RESTSIM="false"
  echo "# Setting Tests to Post Instantiation Characteristic"
  optionsFile='postInstantiationCharacteristic.options.json'
fi

echo "# Uninstall chart"
helm uninstall $CHART_NAME -n eric-eic > /dev/null
rm -rf build > /dev/null

echo "# Packaging Chart & Image"
./gradlew package > /dev/null

gradle_version=$(grep '^version=' gradle.properties | cut -d'=' -f2 | sed 's/-SNAPSHOT$//')
echo "# Pushing Docker Image (proj-eric-oss-dev) using version :" $gradle_version
docker push armdocker.rnd.ericsson.se/proj-eric-oss-dev/eric-oss-auto-config-consistency-testware:$gradle_version > /dev/null

if [ "$RESET_RESTSIM" = "true" ]; then
  echo -e "\n"
  echo "# Resetting Restsim CM Data"
  curl -v --insecure --tlsv1 -c /tmp/cookie.txt -X POST "http://$HOSTIP/login?IDToken1=administrator&IDToken2=TestPassw0rd"
  echo -e "\n\n"
  curl -v --insecure -b /tmp/cookie.txt -X POST "http://$HOSTIP/restore?teamname=rApp&interface=cm"
fi

echo "# Deploying chart to server & Running tests"
./gradlew deploy -PoptionsFile="/resources/config/${optionsFile}" -PproductVersion="${productVersion}" -PbuildUrl="${buildUrl}" -PgasUrl="${INGRESS_HOST}" -PingressSchema="${ingressSchema}" -PingressHost="${INGRESS_HOST}" -PingressLoginUser="${ingressLoginUser}" -PingressLoginPassword="${ingressLoginPassword}" -PrestsimHost="${HOSTIP}" > /dev/null

echo "###########################"
echo "######## Helm Chart #######"
helm ls -Aa | grep 'eacc-testware'
echo "###########################"
echo "######### Pod #############"
kubectl get pods -n eric-eic | grep 'consistency-testware'
echo "###########################"
echo "###########################"

# Revert values.yaml PREFIX
sed -i "s/^\( *EACC_PREFIX: *\).*/\1\"\/eacc\"/" deployment/chart/main/values.yaml
# Revert settings.gradle to use proj-eric-oss-drop
sed -i 's|gradle.ext.repoPrefix = "armdocker.rnd.ericsson.se/proj-eric-oss-dev"|gradle.ext.repoPrefix = "armdocker.rnd.ericsson.se/proj-eric-oss-drop"|' settings.gradle
# Revert the testware chart name
sed -i "s/'$CHART_NAME'/'eacc-testware'/g" gradle/modules/helm.gradle

sleep 5s

kubectl logs -f eric-oss-auto-config-consistency-testware -n eric-eic

if [ "$RESET_RESTSIM" = "true" ]; then
  echo -e "\n"
  echo "# Resetting Restsim CM Data"
  curl -v --insecure --tlsv1 -c /tmp/cookie.txt -X POST "http://$HOSTIP/login?IDToken1=administrator&IDToken2=TestPassw0rd"
  echo -e "\n\n"
  curl -v --insecure -b /tmp/cookie.txt -X POST "http://$HOSTIP/restore?teamname=rApp&interface=cm"
fi
