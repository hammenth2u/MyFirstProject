<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Form\ProjectFormType;
use App\Entity\Project;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index()
    {
        return $this->render('app/index.html.twig', [
            'controller_name' => 'AppController',
        ]);
    }

    /**
     * @Route("/dashboard", name="dashboard")
     */
     public function dashboard(Request $request) : Response
     {
         // Récupération des projets déjà créés par l'utilisateur
         $userProjects = $this->getDoctrine()->getRepository(Project::class)->findUserProjects($this->getUser());

         // Formulaire de création d'un nouveau projet
         $project = new Project();
         $projectForm = $this->createForm(ProjectFormType::class, $project);
         $projectForm->handleRequest($request);

         // Traitement de l'envoi du formulaire
         if ($projectForm->isSubmitted() && $projectForm->isValid()) {

            // Il faudra générer un identifiant unique pour le projet (à voir plus tard pour éviter project/0 -> project/wxzREdf2sd)
        
            $project->setUser($this->getUser());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($project);
            $entityManager->flush();

            // Il faudra aussi ajouter l'accès à l'utilisateur dans la table Access pour qu'il puisse accéder au projet (à voir plus tard)

            return $this->redirectToRoute('dashboard');
        }

        dump($userProjects);

         return $this->render('app/dashboard.html.twig', [
             'controller_name' => 'AppController',
             'userProjects'    => $userProjects,
             'projectForm'     => $projectForm->createView(),
         ]);
     }
}
