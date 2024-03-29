This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Requirements

1. NodeJS
2. MongoDB

## Setup

1. Clone the repository
   `git clone git@github.com:SOSTicos/app.git`

2. Install node modules
   `npm install`

3. Add an `.env` file

4. Add a super admin user at `.env` file with:
   `process.env.SUPERADMIN_EMAIL`

5. Execute the app with `npm run dev`

6. Add a "Centro de Acopio" with a super admin.

   - Open menu icon
   - Click "Centros"
   - Fill the form and submit

7. Complete the form for a "Voluntario" to add all the required fields for the admin and assign a "Centro de Acopio"

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

## Deploy on ZEIT Now

The easiest way to deploy your Next.js app is to use the [ZEIT Now Platform](https://zeit.co/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## AWS Serverless deployment

For deployment with the Serverless framework, the _sls-next/serverless-component@1.16.0_ is used in the **serverless.yml** file. It is important that the AWS account have a policy called _sosticosPolicy_ whose initial definition is as follows:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["ses:*", "s3:*", "logs:*", "lambda:*"],
      "Resource": "*"
    }
  ]
}
```

Such policy will give access to the deployed lambda functions that set of permissions in the SES, S3, logs and lambda services. For security, it is advisable to give specific permissions within those services, instead of everything (\*)

Once all configuration is ready, invoking **npx serverless** from the command line will attempt to deploy the project. However, you do not really to do that since that is done by the **circleci** pipeline.

In order for **serverless** to be able to upload resources, a valid AWS account must be specified. This can be accomplished by specifying the following environment variables:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

Those environment variables corresponds to the **AWS_ACCESS_TOKEN** and **AWS_SECRET_TOKEN** respectively. In addition, a directory called **\$HOME/.aws** may contain a file called **credentials** whose content would be as follows

```config
[default]
aws_access_key_id=xxx
aws_secret_access_key=yyy
```

The UNIX access bit for the file must be **-rw-------**.

## Debugging

To enable debugging, use either Node's _--inspect_ or _--inspect-brk_ arguments. The latter will pause until a debugger is attached. The default debug port is **9299**. Use _--port=<num>_ to override. Examples

```bash
$ node --inspect-brk node_modules/next/dist/bin/next
Debugger listening on ws://127.0.0.1:9229/211d9803-b648-4675-86e9-9fae190482f0
```

At this point, you may be able to attach a debugger at port 9299.
