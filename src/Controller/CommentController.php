<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\checkAccess;
use App\Entity\Access;
use App\Entity\Card;
use App\Entity\Comment;
use App\Entity\Project;
use App\Form\CardFormType;

class CommentController extends AbstractController
{

    /**
     * @Route("/addComment", name="addComment")
     */
    public function addComment(Request $request, checkAccess $service)
    {
        //récup de l'id de la Card
        if ($request->request->get('idCard')) {  
            $idCard = $request->request->get('idCard');
        }

        //recup du contenu du commentaire
        if ($request->request->get('contentComment')) {  
            $contentComment = $request->request->get('contentComment');
        }

        // Récupération des informations liées à la card
        $card = $this->getDoctrine()
        ->getRepository(Card::class)
        ->find($idCard);
        
       // Vérification des accès
       $access = $service->checkAccessUser($this->getUser(), $card->getProject()->getId());

       if ($access === true) {
           // Accès autorisé

           $comment = new Comment();
           $comment->setUser($this->getUser());
           $comment->setCard($card);
           $comment->setContent($contentComment);

           $entityManager = $this->getDoctrine()->getManager();
           $entityManager->persist($comment);
           $entityManager->flush();

           $response = new Response();
           $response->setContent(json_encode(array('OK' => 'Commentaire ajouté')));
           $response->headers->set('Content-Type', 'application/json');
           return $response;
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
     * @Route("/updateComment", name="updateComment")
     */
    public function updateComment(Request $request, checkAccess $service)
    {
        if($request->request->get('idComment')){
            $idComment = $request->request->get('idComment');
        }

        if($request->request->get('contentComment')){
            $contentComment = $request->request->get('contentComment');
        }

        $comment = $this->getDoctrine()->getRepository(Comment::class)->find($idComment);

        $cardID = $comment->getCard()->getId();
        $card = $this->getDoctrine()->getRepository(Card::class)->find($cardID);


        // Vérification des accès
        $access = $service->checkAccessUser($this->getUser(), $card->getProject()->getId());

        
        if ($access === true && $this->getUser() == $comment->getUser()) {
            // Accès autorisé

            $comment->setContent($contentComment);
            $comment->setUpdatedAt(new \DateTime());

            $em = $this->getDoctrine()->getManager();
            $em->persist($comment);
            $em->flush();

            return new Response('commentaire modifié');

        }
        else {
            // Accès non autorisé
        }
    }
}
