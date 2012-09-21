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
        $transactions = $this->getDoctrine()->getRepository('AcmeManagerBundle:Transaction')->findAll();

        $data = array();

        foreach ($transactions as $transaction) {
            $data[] = array(
                'description' => $transaction->getDescription(),
                'value' => $transaction->getValue(),
                'balance' => $transaction->getBalance()
            );
        }

        return new Response(json_encode(array("transactions" => $data)));
    }

    public function saveAction(Request $request) {
        $em = $this->getDoctrine()->getEntityManager();

        //TODO...
        return new Response(array());
    }
}
