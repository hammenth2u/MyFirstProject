<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Access;
use App\Entity\Card;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class CardController extends AbstractController
{
    /**
     * Méthode permettant de renvoyer les données d'une card lors d'un clic sur une des tâches d'un projet
     * 
     * @Route("/getCardData", name="getCardData", methods={"POST"})
     */
    public function getCardData() : Response
    {
        $cardID = $_POST['cardID'];   

        // Récupération des informations liées à la card
        $cardDetails = $this->getDoctrine()
        ->getRepository(Card::class)
        ->find($cardID);

        // Vérification des accès
        $access = $this->getDoctrine()->getRepository(Access::class)->findAccessByUserAndProject($this->getUser(), $cardDetails->getProject()->getId());

        
        if ($access != null) {
            // Accès autorisé
            // $response = new Response();
            // $response->setContent(json_encode(array('cardDetails' => $cardDetails)));
            // $response->headers->set('Content-Type', 'application/json');
            // return $response;
            $formatted = [];
            $formatted [] = [
               'id' => $cardDetails->getId(),
               'name' => $cardDetails->getName(),
               'description' => $cardDetails->getDescription(),
            ];
        
        return new JsonResponse($formatted);

        }
        else {
            // Accès non autorisé
            $response = new Response();
            $response->setContent(json_encode(array('Error' => 'Accès non autorisé')));
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
    }

    /**
     * Méthode permettant de renvoyer les données d'une card lors d'un clic sur une des tâches d'un projet
     * 
     * @Route("/changeCardStatus", name="changeCardStatus", methods={"POST"})
     */
    public function changeCardStatus(Request $request)
    {

        if($request->request->get('idCard')){
            $idCard = $request->request->get('idCard');
        }
        $card = $this->getDoctrine()->getRepository(Card::class)->find($idCard);

        if($request->request->get('status')){
            $status = $request->request->get('status');
            $card->setStatus($status);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($card);
        $em->flush();

        return new Response('statut modifié');
    }
}