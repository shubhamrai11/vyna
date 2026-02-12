module.exports = {


confrimDeleteAccount: (token) => {
    let templateBody = ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #333;">Delete Account Verification</h2>
<p style="margin-bottom: 20px;">You can delete your account by verifying your email address.</p>
<p style="margin-bottom: 20px;">Click the button below to confirm deletion of your account.</p>
<a href="https://app.airsat.co.uk/confirmDelete/${token}" style="display: inline-block; background-color: #DBA86E; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Confirm Account Deletion</a>
</div>`
    return templateBody;
},


confirmationMessage: () => {
    const templateBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Deletion Confirmation</title>
          <style>
                body {
                      font-family: Arial, sans-serif;
                      background-color: #f5f5f5;
                      text-align: center;
                }
                .confirmation-container {
                      background-color: #fff;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      padding: 20px;
                      margin: 50px auto;
                      max-width: 600px;
                }
                h2 {
                      color: #333;
                }
                p {
                      margin-bottom: 20px;
                }
          </style>
    </head>
    <body>
          <div class="confirmation-container">
                <h2>Account Deletion Confirmed</h2>
                <p>Your account has been successfully deleted.</p>
          </div>
    </body>
    </html>
`
    return templateBody;
},


notFoundMessage: () => {
    const templateBody = `
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>User Not Found</title>
 <style>
       body {
             font-family: Arial, sans-serif;
             background-color: #f4f4f4;
             display: flex;
             justify-content: center;
             align-items: center;
             height: 100vh;
             margin: 0;
       }
       .container {
             background-color: #fff;
             border-radius: 8px;
             box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
             padding: 20px;
             text-align: center;
       }
       h1 {
             color: #333;
       }
       p {
             color: #777;
       }
 </style>
</head>
<body>
 <div class="container">
       <h1>User Not Found</h1>
       <p>We couldn't find the user you are looking for delete account.</p>
 </div>
</body>
</html>
`
    return templateBody;
}


}