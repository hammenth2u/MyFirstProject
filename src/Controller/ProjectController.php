<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\checkAccess;
use App\Entity\Access;
use App\Entity\Card;
use App\Entity\Project;
use App\Form\CardFormType;

class ProjectController extends AbstractController
{
    /**
     * @Route("/p/{id}", name="showProject")
     */
    public function showProject(Project $project, Request $request, checkAccess $service) : Response
    {
        $user = $this->getUser();
        $status = null;

        //Pour retourner la liste des utilisateurs d'un projet
        $accesses = $project->getAccesses();
        $listUsers = [];
        foreach($accesses as $currentAccess){
            $listUsers [] = [
                $currentAccess->getUser()->getEmail()
            ];
        }
        
        //$access = $this->getDoctrine()->getRepository(Access::class)->findAccessByUserAndProject($user, $project);
        $access = $service->checkAccessUser($user, $project);

        //dump($access);
   
        //vérification des accès
        if ($access != null) {

        // Récupération des cartes
        $cardsNew = $this->getDoctrine()->getRepository(Card::class)->findCardsByProjectStatus($project, 'new');
        $cardsInProgress = $this->getDoctrine()->getRepository(Card::class)->findCardsByProjectStatus($project, 'inProgress');
        $cardsFinished = $this->getDoctrine()->getRepository(Card::class)->findCardsByProjectStatus($project, 'finished');

        // Gestion de la récupération du status des tâches
        if (isset($_GET['t']))
        {
            $status = $_GET['t'];

            if (($status != 'new') && ($status != 'inProgress') && ($status != 'finished'))
            {
                // Status non valide, on redirige
                $status = null;
                return $this->redirectToRoute('showProject', ['id' => $project->getId() ]);
            }
        }
        else {
            $status = null;
        }

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
           
           $pathInfo = $request->getPathInfo();
           $requestUri = $request->getRequestUri();

           $url = str_replace($pathInfo, rtrim($pathInfo, ' /'), $requestUri);

           return $this->redirect($url, 301);

           //return $this->redirectToRoute('showProject', ['id' => $project->getId() ]);
       }

            return $this->render('project/index.html.twig', [
                'project'               => $project,
                'cardForm'              => $cardForm->createView(),
                'cardsNew'              => $cardsNew,
                'cardsInProgress'       => $cardsInProgress,
                'cardsFinished'         => $cardsFinished,
                'status'                => $status,
                'listUsers'             => $listUsers
            ]);
        } else {
            // Accès non autorisé
            return $this->redirectToRoute('dashboard');
        }

    }
}
