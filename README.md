# Email Templates

## Why

Creating email templates can be a tedious process. The intentions of this Gulp script is to automate some of the tedious process.

## Process

The user should only have to change the `index.html` file and the script should perform the following steps:

1. Minify the HTML
2. Update the email template with the new changes
3. Submit the form so the email is triggered from the Stratus Micoservice

## Issues

1. Text version of email template is still WIP
2. The form and email templates need to be created first and then used here
3. When there is an error, the pipeline does not stop
