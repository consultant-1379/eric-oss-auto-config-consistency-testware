# Run K6 Script

## How to run
Note* This script will overwrite the EACC_PREFIX to "eacc-$SIGNUM" & run the tests against the locally created csar & installed on the server.
1. Ensure your kubeconfig is set correctly
2. Ensure you are logged in to docker (as we need to push the created docker image to the artifactory).
3. Run the following from the root dir:
   ./localScripts/runK6.sh
4. Set the namespace in 'gradle/modules/helm.gradle' -- DON'T COMMIT THIS CHANGE!
5. Change the parameters in runK6.sh: productVersion, buildUrl (if required)

### Arguments
There are three ways/args that can be used:
1. No Argument which will run the pre-onboarding tests by default
2. "functional" - This will run the functional tests
3. "load" - This will run the load tests
4. "post_char" - This will run the post instantiation characteristic tests
e.g.
   ./localScripts/runK6.sh functional
   ./localScripts/runK6.sh load
   ./localScripts/runK6.sh post_char

## Results
1. The helm chart & docker image will be packaged, installed & ran against the cluster in the eric-eic ns
2. Helm release: 'eacc-testware-$SIGNUM' and pod 'eric-oss-auto-config-consistency-testware' will remain on the server
3. The logs will be tailed until complete
4. Finally, it will reset the Restsim Configuration once completed.

## Extra Info
Namespace & testware chart are currently set in helm.gradle
A docker image with the current version will be pushed to proj-eric-oss-dev & overwrite any existing one.
TODO: Improve this to use the signum in the chart version uploaded & configure the chart to use that version
You can hardcode the USER_ID in the script if not running against "eacc-$SIGNUM"

#Limitations in local testing at the moment
Only one testware can be deployed and run at a time, as we still have to improve to use the signum in the chart version.

K6 Tests are accurate as of EACC v1.487.0-1
