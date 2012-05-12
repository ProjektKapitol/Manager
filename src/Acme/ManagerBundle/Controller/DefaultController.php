<?php

namespace Acme\ManagerBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class DefaultController extends Controller
{
    
    public function indexAction()
    {
        return $this->render('AcmeManagerBundle:Default:index.html.twig');
    }
}
