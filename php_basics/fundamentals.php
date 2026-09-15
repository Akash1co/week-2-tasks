<?php
// Variables
$topic = "PHP Fundamentals";
$week = 3;
$day = 1;

// Arrays
$tasks = ["Variables", "Control Flow", "Functions", "Superglobals", "Sanitisation"];

// Functions
function getStatus(array $items): string {
    return count($items) > 0 ? "In Progress" : "Not Started";
}

// Control flow & Display
echo "<h1>" . htmlspecialchars($topic) . " - Week {$week}, Day {$day}</h1>";
echo "<p>Module Status: <strong>" . getStatus($tasks) . "</strong></p>";

echo "<h3>Covered Topics:</h3>";
echo "<ul>";
foreach ($tasks as $index => $task) {
    echo "<li>Step " . ($index + 1) . ": " . htmlspecialchars($task) . "</li>";
}
echo "</ul>";