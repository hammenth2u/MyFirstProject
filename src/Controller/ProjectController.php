<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Access;
use App\Entity\Card;
use App\Entity\Project;
use App\Form\CardFormType;

class ProjectController extends AbstractController
{
    /**
     * @Route("/p/{id}", name="showProject")
     */
    public function showProject(Project $project, Request $request) : Response
    {
        $user = $this->getUser();

        $access = $this->getDoctrine()->getRepository(Access::class)->findAccessByUserAndProject($user, $project);

        //vérification des accès
        if ($access != null) {

        $projectName = $project->getName();

        $cardsNew = $this->getDoctrine()->getRepository(Card::class)->findCardsByProjectStatusNew($project);

        // Formulaire de création d'une nouvelle tâche
        $card = new Card();
        $cardForm = $this->createForm(CardFormType::class, $card);
        $cardForm->handleRequest($request);

        // Traitement de l'envoi du formulaire
        if ($cardForm->isSubmitted() && $cardForm->isValid()) {
       
           $card->setUser($this->getUser());
           $card->setProject($project);
           $card->setStatus('new');
           $entityManager = $this->getDoctrine()->getManager();
           $entityManager->persist($card);
           $entityManager->flush();

           return $this->redirectToRoute('showProject', ['id' => $project->getId() ]);
       }

            return $this->render('project/index.html.twig', [
                'projectName' => $projectName,
                'cardForm'    => $cardForm->createView(),
                'cardsNew'       => $cardsNew
            ]);
        } else {
            // Accès non autorisé
            return $this->redirectToRoute('dashboard');
        }

    }
}
