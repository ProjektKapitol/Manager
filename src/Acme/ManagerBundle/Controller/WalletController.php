<?php

namespace Acme\ManagerBundle\Controller;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;


class WalletController extends Controller
{
    
    public function indexAction()
    {
        return $this->render('AcmeManagerBundle:Wallet:index.html.twig');
    }

    public function dataAction()
    {
        return new Response(json_encode(""));
    }

}
