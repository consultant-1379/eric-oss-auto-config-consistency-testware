# Usecase Scenario
## data_collection_update_on_hold_subscriptions_external
```json
{
    "data_collection_update_on_hold_subscriptions_external": {
        "exec": "data_collection_update_on_hold_subscriptions_external",
        "executor": "per-vu-iterations",
        "vus": 1,
        "env": { "MYVAR": "DCC" },
        "maxDuration": "100s",
        "iterations": 1
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## data_collection_create_thirty_subscriptions_external
```json
{
	  "data_collection_create_thirty_subscriptions_external": {
        "exec": "data_collection_create_thirty_subscriptions_external",
        "executor": "per-vu-iterations",
        "vus": 1,
        "env": { "MYVAR": "DCC" },
        "maxDuration": "100s",
        "iterations": 1
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1).

## data_collection_create_update_delete_subscription_external
```json
{
      "data_collection_create_update_delete_subscription_external": {
        "exec": "data_collection_create_update_delete_subscription_external",
        "executor": "per-vu-iterations",
        "vus": 50,
        "env": { "MYVAR": "DCC" },
        "maxDuration": "100s",
        "iterations": 1
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (50) total 50 iterations. So 50 VUs will create ,update and delete subscription parallely. Here, external endpoint is used.

## data_catalog_register_file_format_4_user_internal
```json 
{
      "data_catalog_register_file_format_4_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_register_internal",
        "vus": 4,
        "iterations": 1,
        "env": { "MYVAR": "PUT" },
        "startTime": "110s",
        "maxDuration": "30s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations   will be vus * iterations. We defined iterations (1) and virtual users (4) total 4 iterations. So 4 VUs will do register file format into datacatalog parallely. Here, internal endpoint is used.

## data_catalog_register_delete_40_external
```json
{
      "data_catalog_register_delete_40_external": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_delete_external",
        "vus": 40,
        "iterations": 1,
        "env": { "MYVAR": "DELETE" },
        "startTime": "140s",
        "maxDuration": "30s"
      },  
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (40) total 40 iterations. So 40 VUs will do delete request into datacatalog parallely. Here, external endpoint is used.

## data_catalog_get_24_user_internal
```json
{
      "data_catalog_get_24_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_get_internal",
        "vus": 24,
        "iterations": 1,
        "maxDuration": "30s",        
        "startTime": "110s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (24) total 24 iterations. So 24 VUs will do get request into datacatalog through internal endpoint parallely.

## data_catalog_get_24_user_external
```json
{
      "data_catalog_get_24_user_external": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_get_external",
        "vus": 24,
        "iterations": 1,
        "maxDuration": "30s",        
        "startTime": "110s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (24) total 24 iterations. So 24 VUs will do get request into datacatalog through external endpoint parallely.

## data_catalog_post_14_user_internal
```json
{
      "data_catalog_post_14_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_post_internal",
        "vus": 14,
        "iterations": 1,
        "maxDuration": "30s",
        "startTime": "110s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (14) total 14 iterations. So 14 VUs will do POST request into datacatalog. Here, internal endpoint is used parallely.

## data_catalog_register_file_format_max_user_internal
```json
{
      "data_catalog_register_file_format_max_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_register_internal",
        "vus": 90,
        "iterations": 1,
        "env": { "MYVAR": "PUT" },  
        "startTime": "175s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (90) total 90 iterations. So 90 VUs will do PUT request into datacatalog through internal endpoint parallely.

## data_catalog_register_delete_max_user_external
```json
{
      "data_catalog_register_delete_max_user_external": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_delete_external",
        "vus": 200,
        "env": { "MYVAR": "DELETE" },
        "startTime": "270s",
        "iterations": 1
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (200) total 200 iterations. So 200 VUs will do DELETE request into datacatalog through external endpoint parallely.

## data_catalog_get_max_user_internal
```json
{
      "data_catalog_get_max_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_get_internal",
        "vus": 1000,
        "iterations": 1,
        "startTime": "310s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1000) total 1000 iterations. So 100 VUs will do GET request into datacatalog through internal endpoint parallely.

## data_catalog_get_max_user_external
```json
{
      "data_catalog_get_max_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_get_internal",
        "vus": 400,
        "iterations": 1,
        "startTime": "310s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (400) total 400 iterations. So 400 VUs will do GET request into datacatalog through external endpoint parallely.

## data_catalog_post_max_user_internal
```json
{
      "data_catalog_post_max_user_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_post_internal",
        "vus": 1000,
        "iterations": 1,
        "startTime": "175s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1000) total 1000 iterations. So 1000 VUs will do POST request into datacatalog through internal endpoint parallely.

## data_catalog_register_message_schema_internal
```json
{
      "data_catalog_register_message_schema_internal": {
        "executor": "per-vu-iterations",
        "exec": "data_catalog_message_schema_register_internal",
        "vus": 1,
        "iterations": 1,
        "env": { "MYVAR": "PUT" },
        "startTime": "1s",
        "maxDuration": "30s"

      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1) total 1 iterations.

## strimzi_bridge_50_requests_external
```json
{
      "strimzi_bridge_50_requests_external": {
        "exec": "strimzi_bridge_produce_message_external",        
        "executor": "per-vu-iterations",
        "env": { "MYVAR": "50_REQ" },
        "vus": 10,
        "iterations": 5,
        "startTime": "40s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (5) and virtual users (10) total 50 iterations. So each VUs will produce message to kafka using bridge 5 times parallely for 10 VUs through external endpoint.

## strimzi_bridge_consume_50_requests_external
```json
{
      "strimzi_bridge_consume_50_requests_external": {
        "exec": "strimzi_bridge_consume_external",
        "executor": "per-vu-iterations",
        "vus": 10,
        "iterations": 5
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (5) and virtual users (10) total 50 iterations. So each VUs will consume message to kafka using bridge 5 times parallely for 10 VUs through external endpoint.

## schema_registry_register_5_schemas_internal
```json
{
      "schema_registry_register_5_schemas_internal": {
        "exec": "schema_registry_register_schema_internal",
        "executor": "per-vu-iterations",
        "vus": 1,
        "startTime": "60s",
        "iterations": 100
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (100) and virtual users (1) total 100 iterations. so 5 number of schema registered in schema registry per second.

## schema_registry_get_60_internal
```json
{
	  "schema_registry_get_60_internal": {
        "exec": "schema_registry_retrieve_schema_internal",
        "executor": "per-vu-iterations",
        "vus": 1,
        "startTime": "60s",
        "iterations": 400
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (400) and virtual users (1) total 400 iterations. so 60 number of schema retrieved from schema registry per second.

## kafka_native_produce_internal
```json
{
      "kafka_native_produce_internal": {
        "exec": "kafka_native_produce_internal",
        "executor": "per-vu-iterations",
        "vus": 10,
        "iterations": 10
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (10) and virtual users (10) total 100 iterations. So each VUs will produce message to kafka 10 times parallely for 10 VUs.

## kafka_native_consume_external
```json
{
      "kafka_native_consume_external": {
        "exec": "kafka_native_consume_external",
        "executor": "per-vu-iterations",
        "vus": 10,
        "iterations": 10
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (10) and virtual users (10) total 100 iterations. So each VUs will consume message to kafka 10 times parallely for 10 VUs.

## schema_registry_register_900_schemas_internal
```json
{
      "schema_registry_register_900_schemas_internal": {
        "exec": "schema_registry_register_schema_internal",
        "executor": "per-vu-iterations",
        "vus": 1,
        "startTime": "430s",
        "iterations": 900
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (900) and virtual users (1) total 900 iterations. So one VU register 900 schema sequentially.

## schema_registry_delete_subject_internal
```json
{
      "schema_registry_delete_subject_internal": {
        "executor": "per-vu-iterations",
        "exec": "schema_registry_delete_subject_internal",
        "vus": 1,
        "iterations": 1,
        "maxDuration": "30s"
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1) total 1 iterations.

## schema_registry_get_60_external
```json
{
      "schema_registry_get_60_external": {
        "exec": "schema_registry_retrieve_schema_external",
        "executor": "per-vu-iterations",
        "vus": 1,
        "startTime": "300s",
        "iterations": 400
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (400) and virtual users (1) total 400 iterations.

## schema_registry_get_compatibility_level_external
```json
{
     "schema_registry_get_compatibility_level_external": {
        "exec": "schema_registry_retrieve_compatibility_level_external",
        "executor": "per-vu-iterations",
        "vus": 1,
        "startTime": "300s",
        "iterations": 1
      },
}
```
* In this scenario we used a per-vu-iterations. So Each VU executes an exact number of iterations. The total number of completed iterations     will be vus * iterations. We defined iterations (1) and virtual users (1) total 1 iterations.