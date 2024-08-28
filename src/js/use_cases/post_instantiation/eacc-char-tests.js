/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */

 import { check, group } from 'k6';

 import * as eacc from '../../modules/eacc.js'

 import { logData } from '../../modules/common.js';
 import { isStatusAccepted, isStatusOk, isStatusCreated, isStatusNoContent, containsHeader, containsExpectedJob, containsExpectedRuleset, containsExpectedScope, containsExpectedMetadata, isExecutionCompleted, containsExpectedTimings, containsExpectedAuditResults, isStatusTooManyRequests, isResponseTimeWithinExpectedThreshold, containsExpectedCharScopesCount } from '../../utils/validationUtils.js';
 import { doesNotContainDeletedJob, doesNotContainDeletedScope, isResponseSuccessfulForExecution } from '../../utils/validationUtils.js';
 import { AuditStatus, ChangeStatus, getAuditStatusFilter, getChangeStatusFilter, EACC_CRUD_TIME_LIMIT, EACC_READ_LIST_CRUD_TIME_LIMIT, EACC_CRUD_ITERATIONS } from '../../modules/eacc-constants.js';

 function verifyPostRulesetIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyPostRulesetIsSuccessful");
     group('WHEN ruleset is created', () => {
         check(eacc.postRuleset(eacc.getRulesetForCharTest()), {
             'THEN status code is 201': (r) => isStatusCreated(r.status),
             'AND Content-Type is application/json': (r) => containsHeader(r.headers, 'Content-Type', 'application/json'),
             'AND response body include ruleset name': (r) => containsExpectedRuleset(r.body, eacc.getRulesetForCharTest().rulesetName)
         })
     });
     eacc.cleanAdminSession();
 }

 function verifyPostScopeIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyPostScopeIsSuccessful");
     group('WHEN scope is created', () => {
         check(eacc.postScopeForCharTest(), {
             'THEN create scope status code is 201': (r) => isStatusCreated(r.status),
             'AND create scope Content-Type is application/json': (r) => containsHeader(r.headers, 'Content-Type', 'application/json'),
             'AND response body includes scope name, uri and non-null id': (r) => containsExpectedScope(r.body, eacc.getScopeForCharTest().scopeName),
             'AND Scope is created within the specified time': (r) => isResponseTimeWithinExpectedThreshold(r.timings.duration, EACC_CRUD_TIME_LIMIT, "Create Scope")
         })
     });
     eacc.cleanAdminSession();
 }

 function verifyReadScopeIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyReadScopeIsSuccessful");
     group('WHEN Scope is read', () => {
         check(eacc.readScope(eacc.findUUIDOfScopeName()), {
             'THEN read scope status code is 200': (r) => isStatusOk(r.status),
             'AND read scope Content-Type is text/csv': (r) => containsHeader(r.headers, 'Content-Type', 'text/csv'),
             'AND read scope response body includes proper fdn csv file': (r) => eacc.verifyCharTestReadScope(r.body),
             'AND Scope is read within the specified time': (r) => isResponseTimeWithinExpectedThreshold(r.timings.duration, EACC_CRUD_TIME_LIMIT, "Read Scope")
         })
     });
     eacc.cleanAdminSession();
 }

 function verifyUpdateScopeIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyUpdateScopeIsSuccessful");
     const UUID_SCOPE = eacc.findUUIDOfScopeName();
     group('WHEN Scope is updated', () => {
         check(eacc.updateScope(UUID_SCOPE, eacc.getCharTestFdnBody()), {
             'THEN update scope status code is 200': (r) => isStatusOk(r.status),
             'AND update scope Content-Type is application/json': (r) => containsHeader(r.headers, 'Content-Type', 'application/json'),
             'AND update scope response body includes proper metadata': (r) => containsExpectedMetadata(r.body, eacc.createMetadata(UUID_SCOPE)),
             'AND Scope is Updated within the specified time': (r) => isResponseTimeWithinExpectedThreshold(r.timings.duration, EACC_CRUD_TIME_LIMIT, "Update Scope")
         })
         check(eacc.readScope(UUID_SCOPE), {
             'AND read updated scope status code is 200': (r) => isStatusOk(r.status),
             'AND read updated scope Content-Type is text/csv': (r) => containsHeader(r.headers, 'Content-Type', 'text/csv'),
             'AND response body includes proper updated fdn csv file': (r) => eacc.verifyCharTestUpdatedScope(r.body)
         })
     });
     eacc.cleanAdminSession();
 }

 function verifyDeleteScopeIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyDeleteScopeIsSuccessful");
     group('WHEN a Scope is Deleted', () => {
             check(eacc.deleteScope(eacc.findUUIDOfScopeName()), {
                 'THEN delete scope status code is 204': (r) => isStatusNoContent(r.status),
                 'AND Scope is deleted within the specified time': (r) => isResponseTimeWithinExpectedThreshold(r.timings.duration, EACC_CRUD_TIME_LIMIT, "Delete Scope")
             });
             check(eacc.getAllScopes(), {
                 'AND read list of scopes returns status 200': (r) => isStatusOk(r.status),
                 'AND read list of scopes Content-Type is application/json': (r) => containsHeader(r.headers, 'Content-Type', 'application/json'),
                 'AND response body does not contain deleted scope': (r) => doesNotContainDeletedScope(r, eacc.findUUIDOfScopeName())
             });
     });
     eacc.cleanAdminSession();
 }

 function verifyCreateAndReadMaxScopesIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyCreateAndReadMaxScopeIsSuccessful");
     group('WHEN Maximum num of scope is created and read list of scopes', () => {
            check(eacc.postNScopeForCharTest(EACC_CRUD_ITERATIONS), {
                 'THEN Average of 50 characteristic scope creation is within the specified time': (r) => isResponseTimeWithinExpectedThreshold(r, EACC_CRUD_TIME_LIMIT, "Create 50 Scopes")
             });
             check(eacc.getAllScopes(), {
                 'AND read list of scopes returns status 200': (r) => isStatusOk(r.status),
                 'AND read list of scopes Content-Type is application/json': (r) => containsHeader(r.headers, 'Content-Type', 'application/json'),
                 'AND response body contains expected count of characteristic scopes': (r) => containsExpectedCharScopesCount(r, EACC_CRUD_ITERATIONS),
                 'AND list of scope is read within the specified time': (r) => isResponseTimeWithinExpectedThreshold(r.timings.duration, EACC_READ_LIST_CRUD_TIME_LIMIT, "Read list of Scopes")
             });
             check(eacc.deleteAllCharScopes(EACC_CRUD_ITERATIONS), {
                 'AND all characteristic test scopes deleted': (r) => r === true
             });
     });
     eacc.cleanAdminSession();
 }

 function verifyPostJobIsSuccessful() {
     eacc.getAdminSessionId();
     logData("verifyPostJobIsSuccessful");
     group('WHEN Job is scheduled', () => {
         check(eacc.postJob(eacc.createJobObjectForCharTest()), {
             'THEN status code is 201': (r) => isStatusCreated(r.status),
             'AND Content-Type is application/json': (r) => containsHeader(r.headers, 'Content-Type', 'application/json'),
             "AND response body contains expected job": (r) => containsExpectedJob(r.body, eacc.createJobObjectForCharTest())
         });
     });
     eacc.cleanAdminSession();
 }

 function verifyAuditTimings() {
     eacc.getUserSessionId();
     logData("verifyAuditTimings");
     group("WHEN viewing Job execution in v1/executions", () => {
          check(eacc.getExecutions(eacc.getJobNameForCharTest()), {
                "THEN status code is 200": (r) => isStatusOk(r.status),
                "AND Content-Type is application/json": (r) => containsHeader(r.headers, "Content-Type", "application/json"),
                "AND Audit completed under specified time": () => containsExpectedTimings(eacc.getJobNameForCharTest(), "AUDIT")
          });
     });
     eacc.cleanAdminSession();
 }

 function verifyApplyAllChanges() {
     logData("verifyApplyAllChanges");
     eacc.getAdminSessionId();
     let changesForImplementationCount = eacc.getNumberOfChanges(eacc.getJobNameForCharTest(), getAuditStatusFilter(AuditStatus.INCONSISTENT));
     group('WHEN Applying All Changes using POST v1/executions/{id}/audit-results', () => {
         check(eacc.applyAllChanges(eacc.getJobNameForCharTest()), {
             'THEN status code is 202': (r) => isStatusAccepted(r.status)
         });
     });
     eacc.cleanAdminSession();
 }

 function verifyChangeImplementationTimings() {
      eacc.getUserSessionId();
      logData("verifyChangeImplementationTimings");
      group("WHEN viewing Apply Changes Job execution in v1/executions", () => {
           check(eacc.getExecutions(eacc.getJobNameForCharTest()), {
                 "THEN status code is 200": (r) => isStatusOk(r.status),
                 "AND Content-Type is application/json": (r) => containsHeader(r.headers, "Content-Type", "application/json"),
                 "AND Apply Changes Audit completed under specified time": () => containsExpectedTimings(eacc.getJobNameForCharTest(), "APPLY")
           });
      });
      eacc.cleanAdminSession();
  }

 function verifyRevertAllChanges() {
     logData("verifyRevertAllChanges");
     eacc.getAdminSessionId();
     let changesForReversionCount = eacc.getNumberOfChanges(eacc.getJobNameForCharTest(), getChangeStatusFilter(ChangeStatus.IMPLEMENTATION_COMPLETE));
     group('WHEN Revert All Changes using POST v1/executions/{id}/audit-results', () => {
         check(eacc.revertAllChanges(eacc.getJobNameForCharTest()), {
             'THEN status code is 202': (r) => isStatusAccepted(r.status)
         });
     });
     eacc.cleanAdminSession();
 }

 function verifyRevertChangesTimings() {
      eacc.getUserSessionId();
      logData("verifyRevertChangesTimings");
      group("WHEN viewing Revert Changes Job execution in v1/executions", () => {
           check(eacc.getExecutions(eacc.getJobNameForCharTest()), {
                 "THEN status code is 200": (r) => isStatusOk(r.status),
                 "AND Content-Type is application/json": (r) => containsHeader(r.headers, "Content-Type", "application/json"),
                 "AND Revert Changes Audit completed under specified time": () => containsExpectedTimings(eacc.getJobNameForCharTest(), "REVERT")
           });
      });
      eacc.cleanAdminSession();
  }

 module.exports = {
    verifyPostRulesetIsSuccessful,
    verifyPostScopeIsSuccessful,
    verifyPostJobIsSuccessful,
    verifyAuditTimings,
    verifyApplyAllChanges,
    verifyChangeImplementationTimings,
    verifyRevertAllChanges,
    verifyRevertChangesTimings,
    verifyReadScopeIsSuccessful,
    verifyUpdateScopeIsSuccessful,
    verifyDeleteScopeIsSuccessful,
    verifyCreateAndReadMaxScopesIsSuccessful
 }
