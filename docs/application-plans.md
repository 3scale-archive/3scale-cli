# Application plans

## Create an application plan

To create a new application plan you'll need to indicate the service the plan will give access to, so make sure you [get the service id first](#services). Then run the following command:
`3scale-cli app-plan --plan <plan_name> create -s <service_id>`

## Get all application plans of a service

By running the following command `3scale-cli app-plan list -s <service_id>` you'll get the following information about application plans for the indicated service:

- application plan id
- application plan name
- status (published / hidden)
- setup fee
- cost per month
- trial period lenght (in days)
- cancellation period length (in days)
- if it's the default application plan for the service (true / false)
- creation date
- latest update date
- if it's a custom plan or not
- application plan system name
- if end users are required

## Display info about existing application plan

To display info about an existing application plan, you will need both the service id and the application id. Then run the following command:
`3scale-cli app-plan -a <appplan_id> show -s <service_id>`

## Delete an existing application plan
`3scale-cli app-plan -a <appplan_id> show -s <service_id>`