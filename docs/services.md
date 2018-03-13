# Services

## Create a new service

`3scale-cli services create --serviceName <service_name> --authentication <mode>`

## Get a list of services

By running the following command `3scale-cli services list` you'll get the following information about the services you have access to:

- service id
- service name
- creation date
- latest update date

## Display info about existing service

To retrieve information about a specific service, run the following command:
`3scale-cli services show -s <service_id>`

## Update an existing service

To update a service run any command and specify the service id. For example, to update the name of a service, run the following command:
`3scale-cli services update --serviceName <new_service_name> -s <service_id>`

## Delete an existing service

To delete a service run the following command:
`3scale-cli services delete -s <service_id>`
