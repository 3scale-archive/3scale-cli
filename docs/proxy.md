# Proxy

## Display info about the proxy linked to an existing service

To retrive information about a proxy, run the following command:
`3scale-cli proxy show -s <service_id>`

## Update an existing proxy

To update a proxy run the following command:
`3scale-cli proxy update -s <service_id> -e <endpoint> -S <sandbox_endpoint> -b <api_backend>`

Note: there's a Request for Enhancement to update the sandbox endpoint which is actually ignored (https://access.redhat.com/solutions/3169141)
