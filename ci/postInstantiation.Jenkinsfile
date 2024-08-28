#!/usr/bin/env groovy

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
        string(name: 'INGRESS_EACC_USER',
                defaultValue: '',
                description: 'The user name to use for eacc')
        string(name: 'INGRESS_EACC_ADMIN',
                defaultValue: '',
                description: 'The user name to use for eacc admin')
        string(name: 'INGRESS_GAS_USER',
                defaultValue: '',
                description: 'The user name to use for gas')
        string(name: 'RESTSIM_HOST',
                defaultValue: 'RESTSIM_HOST',
                description: 'The hostname of restsim')
        string(name: 'CHART_VERSION',
                defaultValue: '',
                description: 'The version of the eacc chart')
        string(name: 'OPTIONS_FILE',
                defaultValue: '/resources/config/postInstantiation.options.json',
                description: 'The name of the optionsFile')
        string(name: 'FUNCTIONAL_USER_SECRET',
                defaultValue: 'cloudman-user-creds',
                description: 'Jenkins secret ID for ARM Registry Credentials')
        string(name: 'EACC_DEPLOYMENT',
               defaultValue: 'eric-oss-auto-config-consistency',
               description: 'Deployment instance name of EACC')
        string(name: 'NAMESPACE',
                defaultValue: 'eric-eic',
                description: 'The namespace of the environment')
        string(name: 'KUBECONFIG',
                defaultValue: 'stsvp1eic26_kubeconfig',
                description: 'The KUBECONFIG file to create secrets ')
        string(name: 'KUBECONFIG_FILE_CREDENTIAL_ID',
                defaultValue: 'stsossflexeiap1003_kubeconfig',
                description: 'The jenkins credential for the kubeconfig of the environment')
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
        timeout(time: 150, unit: 'MINUTES')
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
        TEST_PHASE = "POST_INSTANTIATION"
        INGRESS_EACC_USER = "${params.INGRESS_EACC_USER}"
        INGRESS_EACC_ADMIN = "${params.INGRESS_EACC_ADMIN}"
        INGRESS_GAS_USER = "${params.INGRESS_GAS_USER}"
        VALIDATE_EACC_RBAC = "true"
        NAMESPACE = "${params.NAMESPACE}"
        KUBECONFIG_FILE_CREDENTIAL_ID = "${params.KUBECONFIG_FILE_CREDENTIAL_ID}"
        OPTIONS_FILE = "${params.OPTIONS_FILE}"
        GAS_URL = "${params.GAS_URL}"
        ENVIRONMENT = "${params.ENVIRONMENT}"
    }

    // Stage names (with descriptions) taken from ADP Microservice CI Pipeline Step Naming Guideline: https://confluence.lmera.ericsson.se/pages/viewpage.action?pageId=122564754
    stages {
        stage('Clean') {
            steps {
                sh "rm -rf ./.aws ./.kube/ ./.cache/"
                archiveArtifacts allowEmptyArchive: true, artifacts: 'ci/postInstantiation.Jenkinsfile'
            }
        }
        stage('Test Preparation') {
            steps {
                withCredentials([file(credentialsId: "$KUBECONFIG_FILE_CREDENTIAL_ID", variable: 'KUBECONFIG_FILE_PATH')]) {
                    sh "chmod 777 src/scripts/populate_database.sh"
                    sh "src/scripts/populate_database.sh"
                }
            }
        }
        stage('K6 Post Instantiation E2E Tests') {
            steps {
                 withCredentials([file(credentialsId: "${params.KUBECONFIG}", variable: 'KUBECONFIG'),
                 usernamePassword(credentialsId: "$FUNCTIONAL_USER_SECRET", usernameVariable: 'FUNCTIONAL_USER_USERNAME', passwordVariable: 'FUNCTIONAL_USER_PASSWORD')]) {
                     sh "chmod 777 ci/scripts/k6-eacc-testware-execution.sh"
                     sh "ci/scripts/k6-eacc-testware-execution.sh"
                 }
                 withCredentials([file(credentialsId: "$KUBECONFIG_FILE_CREDENTIAL_ID", variable: 'KUBECONFIG_FILE_PATH')]) {
                     sh "chmod 777 ci/scripts/postInstantiation_db_cleanup.sh"
                     sh "ci/scripts/postInstantiation_db_cleanup.sh"
                 }
            }
            post {
                always {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'doc/Test_Report/k6.log.gz'
                }
            }
        }
        stage('Cypress Post Instantiation UI Tests') {
            steps {
                sh "rm -rf ./src/js/modules/integration/product_staging/cypress/results/cypress_tests.json || true"
                sh "chmod 777 ./cypress_product_staging.sh"
                sh "./cypress_product_staging.sh"
            }
            post {
                always {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'src/js/modules/integration/product_staging/cypress/results/cypress_test_results.html'
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'src/js/modules/integration/product_staging/cypress/results/cypress_tests.json'
                }
            }
        }
    }
}

