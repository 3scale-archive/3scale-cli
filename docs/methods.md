# Methods

## Create a new method

Methods correspond to the endpoints of your API. To create a new method, you'll need the following information:

- service id
- metric id

To create a new method, run the following command:

`3scale-cli methods create -d <method_name> -s <service_id> -m <metric_id>`

*Note*: The metric id needs to correspond to the 'Hits' id.

## Get all methods of a service attached to a specific metric

`3scale-cli methods list -s <service_id> -m <metric_id>`

## Display info about a specific method
`3scale-cli methods show -t <method_id> -s <service_id> -m <metric_id>`

## Update an existing method

You can update the name of a method running the following command:

`3scale-cli method update -d <method_name> -s <service_id> -m <metric_id> -t <method_id>`

## Delete a method
`3scale-cli methods delete -t <method_id> -s <service_id> -m <metric_id>`


