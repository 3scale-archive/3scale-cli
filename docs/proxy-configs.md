# Proxy Configs

## Get a list of proxy configs

By running the following command `3scale-cli proxy-configs list -s <service_id> -e <environment_name>` you'll get the following information about the services you have access to:

- proxy config id
- version
- environment name

## Display info about the proxy config

To retrive information about a proxy config, run the following command:
`3scale-cli proxy-configs show -s <service_id> -e <environment_name> -c <config_version>`

## Promote an existing proxy config to the production environment

To promote a proxy config to the production environment run the following command:
`3scale-cli proxy-configs promote -s <service_id> -c <config_version>`
