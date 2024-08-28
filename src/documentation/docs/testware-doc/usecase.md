## Functional Usecase


| Usecase NO   | Usecase ID   | Usecase NAME                                                                     |
|--------------|--------------|----------------------------------------------------------------------------------|
| 1            |              | Data catalog delete BDR                                                          | 
| 2            |              | Data catalog delete MB                                                           |
| 3            |              | Query BDR from data catalog through rapp                                         | 
| 4            |              | Query BDR from data catalog                                                      |
| 5            |              | Query MB from data catalog through rapp                                          | 
| 6            |              | Query MB from data catalog                                                       |
| 7            |              | Data catalog register BDR                                                        | 
| 8            |              | Data catalog register MB                                                         |
| 9            |              | Data catalog register file format                                                | 
| 10           |              | Data catalog register message schema                                             |
| 11           |              | Data  collection controller create subscription                                  | 
| 12           |              | Data collection controller create thirty subscription                            |
| 13           |              | Data collection controller update predicate parameter                            | 
| 14           |              | Data collection controller update predicate parameter for onhold subscription    |
| 15           |              | Data collection controller delete subscription                                   | 
| 16           |              | Kafka native produce message                                                     |
| 17           |              | Kafka consume message                                                            | 
| 18           |              | Schema registery register schema                                                 |
| 19           |              | Schema register retrive schema                                                   | 
| 20           |              | Strimzi bridge produce message                                                   |
| 21           |              | Strimzi bridge consume message                                                   |
| 22           |              |  Delete subject from schema                                                      |
| 23           |              |  Register compatibility level from schema                                        |
| 24           |              |  Register schema from schema registry using ID via ingress                       |
| 25           |              |  Register schema from schema registry using version via ingress                  |
| 26           |              | Create, update & delete subscription through Data collection controller and message schema  |
| 27           |              |  Query Data service instance Details through data catalog                         |
| 28           |              |  Query Data service  Details through data catalog                                 |
| 29           |              |  Query Kafka Details for files from data catalog                                  |
| 30           |              |  Query Kafka Details for streams from data catalog                                |
| 31           |              |  Retrieve data provider type from data  catalog                                   |
| 32           |              |  Retrieve data space from data  catalog                                           |
| 33           |              |  Query notification topic Details for subscription from data catalog              |
| 34           |              |  Query messagedata topic Details for subscription from data catalog               |
| 35           |              | Query  Details for subscription from data catalog for external                    |
| 36           |              | Query  Details for subscription from data catalog for internal                    |

## Non Functional Load Test

| Kafka  | Data Catalog  | Strimzi Bridge |  Schema Registry | Data Collection Controller |
|--------|---------------|----------------|------------------|----------------------------|
| Ability to send 25K messages per second of size 1KB across 10 topics | 90 number of maximum users parallelly for PUT API | Ability to send 35 number of messages per second | Max 900 number of schema registered in schema registry |50 concurrent users Subscribe API should take less than or equal to 10 seconds  |
| Ability to receive 25K messages per second of size 1KB across 10 topics| 1000 number of maximum users parallelly for POST API | Ability to received 35 number of messages per second | 350 number of schema registered in schema registry per second | 50 concurrent users, unsubscribe API should take less than or equal to one second |
| Capable of sending and receiving the message of maximum size 35 KB | 1000 number of maximum users parallelly for GET API | Capable of sending and receiving the messages of maximum size of 35 KB | 500 number of schema retrieved from schema registry per second | 50 concurrent users patch API should take less than or equal 10 seconds |
| total time (in seconds) to serve the specified request (Produce/Fetch) should be less than 3 seconds for at least 50 request | 900 number of maximum users parallelly for DELETE API | total time (in seconds) to serve the specified request (Produce/Fetch) should be less than 3 seconds for at least 50 request |  |   |
| total number of return error code( internal error code ) for consumer can be 1 per 500 | 24 concurrent users GET API should take less than a second | total number of return error code( internal error code ) for consumer can be 1 per 500 |  |   |
| total number of return error code( internal error code ) for producer can be 1 per 500 | 13 concurrent users PUT API should take less than a second | total number of return error code( internal error code ) for producer can be 1 per 500 |  |  |
|   | 40 concurrent users DELETE API should take less than a second |   |   |   |
|   | 14 concurrent users POST API should take less than a second   |   |   |   |









