<?php

namespace Acme\ManagerBundle\Controller;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class CalendarController extends Controller
{
    
    public function indexAction()
    {
        return $this->render('AcmeManagerBundle:Calendar:index.html.twig', array("days" => "asdasd"));
    }
    
    public function jsonDataAction()
    {
        return new Response(json_encode(array(
            "view" => "days",
            "data" => array(
                array("date" => 1),
                array("date" => 2),
                array("date" => 3)
            )
        )));
    }

}
