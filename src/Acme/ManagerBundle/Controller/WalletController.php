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

    public function categoriesDataAction()
    {
        $categories = $this->getDoctrine()->getRepository('AcmeManagerBundle:TransactionCategory')->findAll();

        $data = array();

        foreach ($categories as $category) {
            $data[] = array("name" => $category->getName());
        }

        return new Response(json_encode($data));
    }

    public function transactionsDataAction($categoryId)
    {
        $transactions = $this->getDoctrine()->getRepository('AcmeManagerBundle:Transaction')->findByCategory($categoryId);

        $data = array();

        foreach ($transactions as $transaction) {
            $data[] = array(
                'description' => $transaction->getDescription(),
                'value' => $transaction->getValue()
            );
        }

        return new Response(json_encode($data));
    }
}
