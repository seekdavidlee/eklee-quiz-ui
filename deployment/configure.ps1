param($Endpoint, $ReadonlyEndpoint, $ClientId, $TenantId)

$envObj = 'export const environment = {
    production: true,
    graphQL: {
      endpoint: "%endpoint%",
      readonlyEndpoint: "%readonly-endpoint%"
    },
    adalConfig: {
      clientId: "%client-id%",
      tenant: "%tenant-id%",
      cacheLocation: "localStorage",
      redirectUri: window.location.origin,
      endpoints: {
        "api": "%client-id%"
      }
    }
  };'

$envObj = $envObj.Replace("%endpoint%", $Endpoint)
$envObj = $envObj.Replace("%readonly-endpoint%", $ReadonlyEndpoint)
$envObj = $envObj.Replace("%client-id%", $ClientId)
$envObj = $envObj.Replace("%tenant-id%", $TenantId)

Set-Content -Path ./src/environments/environment.prod.ts -Value $envObj