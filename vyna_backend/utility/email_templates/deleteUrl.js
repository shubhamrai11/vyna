exports.DeleteTemplate = () => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delete Account Confirmation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <style>
            /* Styles for better presentation */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333;
            }
            p {
                margin-bottom: 20px;
            }
            .form-group {
                margin-bottom: 20px;
                margin-right: 34px;
            }
            .form-group label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .form-group input[type="email"] {
                width: 100%;
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #ccc;
            }
            .btn {
                display: inline-block;
                background-color: #DBA86E;
                color: #fff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
            }
            .error-message {
                color: red;
                margin-top: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2><i class="fas fa-trash-alt" style="margin-right: 10px;"></i>Delete Your Account</h2>
            <p>You can delete your account by verifying your email address.</p>
            <form id="deleteAccountForm">
                <div class="form-group">
                    <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}">
                    <div class="error-message" id="emailError"></div> <!-- Error message for email validation -->
                </div>
                <button type="button" class="btn" onclick="sendVerificationEmail()">Send Verification Email</button>
            </form>
        </div>

        <script>
            function sendVerificationEmail() {
                var email = document.getElementById("email").value;
                var sendButton = document.querySelector(".btn");

                // Disable the button to prevent multiple clicks during the process
                sendButton.disabled = true;
                sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // Check if the email field is empty
                if (!email.trim()) {
                    document.getElementById("emailError").innerText = "Email is required.";
                    sendButton.disabled = false; // Enable the button
                    sendButton.innerHTML = 'Send Verification Email';
                    return;
                } else {
                    document.getElementById("emailError").innerText = ""; // Clear error message if email is provided
                }

                // Validate email format
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email)) {
                    document.getElementById("emailError").innerText = "Please enter a valid email address.";
                    sendButton.disabled = false; // Enable the button
                    sendButton.innerHTML = 'Send Verification Email';
                    return;
                } else {
                    document.getElementById("emailError").innerText = ""; // Clear error message if email is valid
                }

                // Send the email address to the backend to send the verification email
                fetch('/sendVerificationEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                }).then(response => {
                    if (response.status === 200) {
                        alert("Verification email sent successfully.");
                    } else if (response.status === 404) {
                        alert("Email Id is not registered with Us!!");
                    } else {
                        alert("An error occurred while sending the verification email. Please try again later.");
                    }
                    sendButton.disabled = false; // Enable the button
                    sendButton.innerHTML = 'Send Verification Email';
                }).catch(error => {
                    alert("An error occurred while sending the verification email. Please try again later.");
                    sendButton.disabled = false; // Enable the button
                    sendButton.innerHTML = 'Send Verification Email';
                });
            }
        </script>
    </body>
    </html>`;
};
