<?php

require "core/View.php";
require "core/Request.php";
require "core/AbstractController.php";
require "app/controllers/HomeController.php";

$view = new View("app/views/");

$controller = new HomeController($view, "message");
echo $controller->render("home");

?>