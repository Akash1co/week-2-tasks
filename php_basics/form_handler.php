<?php
// Initialise session for superglobal demonstration
session_start();

$errors = [];
$submittedData = null;

// Read source via $_GET
$source = isset($_GET['source']) ? htmlspecialchars(trim($_GET['source']), ENT_QUOTES, 'UTF-8') : 'Direct Access';

// Process form submission via $_POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 1. Sanitisation
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $feedback = trim($_POST['feedback'] ?? '');

    // 2. Server-side Validation
    if (empty($username)) {
        $errors[] = "Username is required.";
    } elseif (strlen($username) < 3) {
        $errors[] = "Username must be at least 3 characters.";
    }

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please provide a valid email address.";
    }

    if (empty($feedback)) {
        $errors[] = "Feedback cannot be empty.";
    }

    // 3. Save to $_SESSION and prepare output
    if (empty($errors)) {
        $_SESSION['last_submission'] = date('Y-m-d H:i:s');

        $submittedData = [
            'username' => htmlspecialchars($username, ENT_QUOTES, 'UTF-8'),
            'email'    => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
            'feedback' => htmlspecialchars($feedback, ENT_QUOTES, 'UTF-8'),
            'time'     => $_SESSION['last_submission']
        ];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PHP Form Handling</title>
    <style>
        body { font-family: sans-serif; margin: 30px; line-height: 1.5; }
        .box { max-width: 450px; }
        .error { color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; }
        .success { color: #2e7d32; background: #e8f5e9; padding: 10px; border-radius: 4px; }
        .field { margin-bottom: 12px; }
        input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
    </style>
</head>
<body>
    <div class="box">
        <h2>Feedback Form</h2>
        <p><small>Source: <?= $source ?></small></p>

        <?php if (!empty($errors)): ?>
            <div class="error">
                <ul>
                    <?php foreach ($errors as $err): ?>
                        <li><?= htmlspecialchars($err, ENT_QUOTES, 'UTF-8') ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php if ($submittedData): ?>
            <div class="success">
                <h4>Submission Received!</h4>
                <p><strong>Username:</strong> <?= $submittedData['username'] ?></p>
                <p><strong>Email:</strong> <?= $submittedData['email'] ?></p>
                <p><strong>Message:</strong> <?= nl2br($submittedData['feedback']) ?></p>
                <p><small>Submitted at: <?= $submittedData['time'] ?></small></p>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="field">
                <label>Username:</label>
                <input type="text" name="username" value="<?= isset($_POST['username']) ? htmlspecialchars($_POST['username']) : '' ?>">
            </div>
            <div class="field">
                <label>Email:</label>
                <input type="email" name="email" value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '' ?>">
            </div>
            <div class="field">
                <label>Feedback:</label>
                <textarea name="feedback" rows="4"><?= isset($_POST['feedback']) ? htmlspecialchars($_POST['feedback']) : '' ?></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</body>
</html>