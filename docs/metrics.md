# Metrics

## Create a new metric
`3scale-cli metrics create -m <metric_name> -s <service_id>`

## Get all metric of a service
`3scale-cli metrics list -s <service_id>`

## Display info about a specific metric
`3scale-cli metrics show -c <metric_id> -s <service_id>`

## Update an existing metric

You can update the following date about a metric:

### Updating metric name
`3scale-cli metrics update -c <metric_id> -s <service_id> -m <new_metric_name>`

### Updating metric unit
`3scale-cli metrics update -c <metric_id> -s <service_id> -m <new_unit>`

## Delete a metric
`3scale-cli metrics delete -c <metric_id> -s <service_id>`