<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CardController extends AbstractController
{
    /**
     * @Route("/p/{id}/new", name="card")
     */
    public function index()
    {
        return $this->render('card/index.html.twig', [
            'controller_name' => 'CardController',
        ]);
    }
}
