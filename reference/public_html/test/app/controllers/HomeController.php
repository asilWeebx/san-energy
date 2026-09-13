<?php

class HomeController extends AbstractController {

    protected function render($page){
        return $this->view->render($page, [
            "title" => "Главная страница",
            "name" => "Davlatbek"
        ], true);
    }

    protected function accessDenied(){
        echo "Доступ запрещён";
    }

    protected function action404(){
        echo "Страница не найдена";
    }

}

?>