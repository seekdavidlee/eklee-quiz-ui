# EkleeQuiz

This is the frontend to a quiz API backend I have [created](https://github.com/seekdavidlee/eklee-quiz-api). Ideally, you will be running that backend project locally while developing this frontend. 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.6.

## Getting Started

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Create a local environment file in src/environments/environment.ts. For Prod, create an environment.prod.ts file.

Use the following keeping in mind you need to be running the backend project. The AppId would be the audience you have configured on your backend. The tenant Id would again be similar, which is the Azure Active Directory Id. You may keep the same values in production but the endpoints would be different.

```
export const environment = {
  production: false,
  graphQL: {
    endpoint: "http://localhost:7071/api/graph",
    readonlyEndpoint: "http://localhost:7071/api/readonly-graph"
  },
  adalConfig: {
    clientId: "<AppId>",
    tenant: "<TenantId>",
    cacheLocation: "localStorage",
    redirectUri: window.location.origin,
    endpoints: {
      "api": "<AppId>"
    }
  }
};
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Hosting

The recommendation is to host this on Azure Storage as a static website or even on AWS S3 which also has the ability to run as a static website.
