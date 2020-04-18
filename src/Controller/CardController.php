<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Access;
use App\Entity\Card;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Service\checkAccess;


class CardController extends AbstractController
{
    /**
     * Méthode permettant de renvoyer les données d'une card
     * 
     * @Route("/getCardData", name="getCardData", methods={"POST"})
     */
    public function getCardData(checkAccess $service) : Response
    {
        $cardID = $_POST['cardID']; 
        
        // Récupération des informations liées à la card
        $cardDetails = $this->getDoctrine()
        ->getRepository(Card::class)
        ->find($cardID);

        // Vérification des accès
        $access = $service->checkAccessUser($this->getUser(), $cardDetails->getProject()->getId());

        if ($access === true) {
            // Accès autorisé
            // Récupération + formattage commentaires
            $comments = [];
            foreach ($cardDetails->getComments() as $value)
            {
                $comments[] =  
                [
                    'userId' => $value->getUser()->getId(),
                    'content' => $value->getContent(),
                    'mail' => $value->getUser()->getUsername(),
                    'createdAt' => $value->getCreatedAt()
                ];   
            }
            
            $formatted = [];
            $formatted [] = [
               'userConnected' => $this->getUser()->getId(),
               'userEmail' => $this->getUser()->getUsername(),
               'id' => $cardDetails->getId(),
               'name' => $cardDetails->getName(),
               'description' => $cardDetails->getDescription(),
               'comments' => $comments,
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
     * Méthode permettant de modifier le statut d'une tâche
     * 
     * @Route("/updateCardStatus", name="updateCardStatus", methods={"POST"})
     */
    public function updateCardStatus(Request $request, checkAccess $service)
    {
        if ($request->request->get('idCard')) {
            
            $idCard = $request->request->get('idCard');

            // Récupération des informations liées à la card
            $card = $this->getDoctrine()
            ->getRepository(Card::class)
            ->find($idCard);

            // Si $card est null, voir pour retourner une erreur au front

            // Vérification des accès
            $access = $service->checkAccessUser($this->getUser(), $card->getProject()->getId());
            //$access = $this->getDoctrine()->getRepository(Access::class)->findAccessByUserAndProject($this->getUser(), $card->getProject()->getId());
        }

        if ($access === true) {
            // Accès autorisé
            if($request->request->get('status')){
                // A faire : Vérifier que le statut est soit "new" ou "inProgress" ou "finished" -> Sinon retourner une erreur au front
                $status = $request->request->get('status');
                $card->setStatus($status);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($card);
            $em->flush();

            return new Response('statut modifié');

        }
        else {
            // Accès non autorisé
        }
    }

    /**
     * Méthode permettant de modifier la description d'une card
     * 
     * @Route("/updateCardDescription", name="updateCardDescription", methods={"POST"})
     */
    public function updateCardDescription(Request $request, checkAccess $service)
    {
        if ($request->request->get('idCard')) {
            
            $idCard = $request->request->get('idCard');

            // Récupération des informations liées à la card
            $card = $this->getDoctrine()
            ->getRepository(Card::class)
            ->find($idCard);

            // Si $card est null, voir pour retourner une erreur au front

            // Vérification des accès
            $access = $service->checkAccessUser($this->getUser(), $card->getProject()->getId());
        }

        if ($access === true) {
            // Accès autorisé
            if($request->request->get('description')){
                $description = $request->request->get('description');

                $card->setDescription($description);

                $em = $this->getDoctrine()->getManager();
                $em->persist($card);
                $em->flush();

                return new Response('Description modifiée');
            }
        }
        else {
            // Accès non autorisé
        }
    }

     /**
     * Méthode permettant de modifier le nom d'une card
     * 
     * @Route("/updateCardName", name="updateCardName", methods={"POST"})
     */
    public function updateCardName(Request $request, checkAccess $service)
    {
        if ($request->request->get('idCard')) {
            
            $idCard = $request->request->get('idCard');

            // Récupération des informations liées à la card
            $card = $this->getDoctrine()
            ->getRepository(Card::class)
            ->find($idCard);

            // Si $card est null, voir pour retourner une erreur au front

            // Vérification des accès
            $access = $service->checkAccessUser($this->getUser(), $card->getProject()->getId());
        }

        if ($access === true) {
            // Accès autorisé
            if($request->request->get('name')){
                $name = $request->request->get('name');
                $card->setName($name);

                $em = $this->getDoctrine()->getManager();
                $em->persist($card);
                $em->flush();

                return new Response('Nom modifié');
            }
        }
        else {
            // Accès non autorisé
        }
    }
}