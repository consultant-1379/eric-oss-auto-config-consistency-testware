#!/usr/bin/env groovy

def bob = "./bob/bob"

pipeline {
    agent {
        label env.SLAVE_LABEL
    }

    parameters {
        string(name: 'GERRIT_REFSPEC',
                defaultValue: 'refs/heads/master',
                description: 'Referencing to a commit by Gerrit RefSpec')
        string(name: 'SLAVE_LABEL',
                defaultValue: 'evo_docker_engine_gic_IDUN',
                description: 'Specify the slave label that you want the job to run on')
        string(name: 'INGRESS_PREFIX',
                defaultValue: '',
                description: 'The prefix to the ingress URL')
        string(name: 'GAS_URL',
                defaultValue: '',
                description: 'The GAS_URL')
        string(name: 'INGRESS_HOST',
                defaultValue: '',
                description: 'The EIC APIGW Host')
        string(name: 'INGRESS_LOGIN_USER',
                defaultValue: '',
                description: 'The user name to use for login')
        string(name: 'INGRESS_CPS_USER',
                defaultValue: '',
                description: 'The user name to use for cps')
        string(name: 'INGRESS_LOGIN_PASSWORD',
                defaultValue: '',
                description: 'The password to use')
        string(name: 'NAMESPACE',
                defaultValue: 'eric-eic',
                description: 'The EIC NAMESPACE')
        string(name: 'KUBECONFIG',
                defaultValue: 'stsvp1eic26_kubeconfig',
                description: 'The KUBECONFIG file to create secrets ')
        string(name: 'RESTSIM_HOST',
                defaultValue: 'RESTSIM_HOST',
                description: 'The hostname of restsim')
        string(name: 'OPTIONS_FILE',
                defaultValue: '/resources/config/preOnboarding.options.json',
                description: 'The name of the optionsFile')
        string(name: 'CHART_VERSION',
                defaultValue: '',
                description: 'The version of the eacc chart')
        string(name: 'INSTANTIATION_TYPE',
                defaultValue: '',
                description: 'The type of instantiation to be performed. "initial_instantiation" OR "instantiation_to_higher_version"')
        string(name: 'BUCKET_NAME',
                defaultValue: 'RH_C16A013_OSTK_certificates',
                description: 'The name of bucket to get certs from.')
        string(name: 'FUNCTIONAL_USER_SECRET',
                defaultValue: 'cloudman-user-creds',
                description: 'Jenkins secret ID for ARM Registry Credentials')
        string(name: 'EACC_DEPLOYMENT',
               defaultValue: 'eric-oss-auto-config-consistency',
               description: 'Deployment instance name of EACC')
        string(name: 'EACC_PREFIX',
                defaultValue: '/eacc',
                description: 'Prefix for EACC instance')
        string(name: 'EACC_TESTWARE_NAME',
                defaultValue: 'eric-oss-auto-config-consistency-testware',
                description: 'The name of eacc testware')
        string(name: 'ENVIRONMENT',
                 defaultValue: 'production',
                 description: 'the base image to push data to the production database')
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(daysToKeepStr: '14', numToKeepStr: '40', artifactNumToKeepStr: '40', artifactDaysToKeepStr: '14'))
    }

    environment {
        INGRESS_SCHEMA = "${params.INGRESS_PREFIX}"
        INGRESS_HOST = "${params.INGRESS_HOST}"
        RESTSIM_HOST = "${params.RESTSIM_HOST}"
        CHART_VERSION = "${params.CHART_VERSION}"
        EACC_TESTWARE_NAME = "${params.EACC_TESTWARE_NAME}"
        INGRESS_LOGIN_USER = "${params.INGRESS_LOGIN_USER}"
        INGRESS_CPS_USER = "${params.INGRESS_CPS_USER}"
        INGRESS_LOGIN_PASSWORD = "${params.INGRESS_LOGIN_PASSWORD}"
        STAGING_LEVEL = "PRODUCT"
        TEST_PHASE = "PRE_ONBOARDING"
        NAMESPACE = "${params.NAMESPACE}"
        INSTANTIATION_TYPE = "${params.INSTANTIATION_TYPE}"
        EACC_DEPLOYMENT = "${params.EACC_DEPLOYMENT}"
        EACC_PREFIX = "${params.EACC_PREFIX}"
        BUCKET_NAME = "${params.BUCKET_NAME}"
        DATAFILE_NAME_LA = "la-http-server"
        DATAFILE_TYPE_CRT = "crt"
        DATAFILE_TYPE_KEY = "key"
        OPTIONS_FILE = "${params.OPTIONS_FILE}"
        GAS_URL = "${params.GAS_URL}"
        ENVIRONMENT = "${params.ENVIRONMENT}"
    }

    // Stage names (with descriptions) taken from ADP Microservice CI Pipeline Step Naming Guideline: https://confluence.lmera.ericsson.se/pages/viewpage.action?pageId=122564754
    stages {
        stage('Clean') {
            steps {
                sh "rm -rf ./.aws ./.kube/ ./.cache/"
                archiveArtifacts allowEmptyArchive: true, artifacts: 'ci/preOnboarding.Jenkinsfile'
            }
        }
        stage('Clean PVCs') {
            when {
                environment name: 'INSTANTIATION_TYPE', value: 'initial_instantiation'
            }
            steps {
                withCredentials([file(credentialsId: "${params.KUBECONFIG}", variable: 'KUBECONFIG')]) {
                    sh "chmod 777 ci/scripts/preOnboarding_env_cleanup.sh"
                    sh "ci/scripts/preOnboarding_env_cleanup.sh"
                }
            }
        }
        stage ('Fetch certs required for MTLS') {
            steps {
                withCredentials([usernamePassword(credentialsId: params.FUNCTIONAL_USER_SECRET, usernameVariable: 'FUNCTIONAL_USER_USERNAME', passwordVariable: 'FUNCTIONAL_USER_PASSWORD')]) {
                    sh '''
                    git submodule sync
                    git submodule update --init --recursive --remote
                    '''
                    sh "${bob} -r ci/local_ruleset.yaml ost_bucket:download-files-by-name-in-ost-bucket-la-crt ost_bucket:download-files-by-name-in-ost-bucket-la-key"
                }
            }
        }
        stage('Create secrets required for MTLS') {
            steps {
                withCredentials([file(credentialsId: "${params.KUBECONFIG}", variable: 'KUBECONFIG')]) {
                    sh "kubectl create secret generic mtls-secret --from-file=cert.crt=la-http-server.crt --from-file=keystore.key=la-http-server.key -n $NAMESPACE || true"
                }
            }
        }
        stage('K6 Pre On Boarding Tests') {
            steps {
                 withCredentials([file(credentialsId: "${params.KUBECONFIG}", variable: 'KUBECONFIG'),
                 usernamePassword(credentialsId: "$FUNCTIONAL_USER_SECRET", usernameVariable: 'FUNCTIONAL_USER_USERNAME', passwordVariable: 'FUNCTIONAL_USER_PASSWORD')]) {
                    sh "chmod 777 ci/scripts/k6-eacc-testware-execution.sh"
                    sh "ci/scripts/k6-eacc-testware-execution.sh"
                 }
            }
            post {
                always {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'doc/Test_Report/k6.log.gz'
                }
            }
        }
    }
}


