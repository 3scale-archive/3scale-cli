# Mapping rules

## Create a mapping rule
`3cale-cli maprules create -p <pattern> -h <HTTP_VERB> -d <delta> -m <metric_id> -s <service_id>`

## Get all mapping rules of a service
`3cale-cli maprules list -s <service_id>`

## Display info about exising mapping rule
`3cale-cli maprules show -s <service_id> -r <mapping_rule_id> [options]`

## Update an existing mapping rule
`3cale-cli maprules list -s <service_id> -r <mapping_rule_id> [options]`

You can update a specific attribute or all at the same time, possible values:
`-p <pattern> -h <HTTP_VERB> -d <delta> -m <metric_id>`

## Delete existing mapping rule
`3cale-cli maprules delete -s <service_id> -r <mapping_rule_id> [options]`