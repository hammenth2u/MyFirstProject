<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Access;
use App\Entity\Card;
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
         $userProjects = $this->getDoctrine()->getRepository(Access::class)->findByUser($this->getUser());

         // Formulaire de création d'un nouveau projet
         $project = new Project();
         $projectForm = $this->createForm(ProjectFormType::class, $project);
         $projectForm->handleRequest($request);

         // Traitement de l'envoi du formulaire
         if ($projectForm->isSubmitted() && $projectForm->isValid()) {

            // Il faudra générer un identifiant unique pour le projet (à voir plus tard pour éviter project/0 -> project/wxzREdf2sd)
        
            $userId = $this->getUser()->getId();
            
            $project->setUser($this->getUser());
            //Generate a random string.
            $token = openssl_random_pseudo_bytes(16);
            
            //Convert the binary data into hexadecimal representation.
            $token = bin2hex($token);
            $project->setToken($token.$userId);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($project);
            $entityManager->flush();

            // Création de l'accès au projet
            $access = new Access();
            $access->setUser($this->getUser());
            $access->setProject($project);
            $access->setAccessType('admin');
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($access);
            $entityManager->flush();

            return $this->redirectToRoute('dashboard');
        }

         return $this->render('app/dashboard.html.twig', [
             'controller_name' => 'AppController',
             'userProjects'    => $userProjects,
             'projectForm'     => $projectForm->createView(),
         ]);
     }

    /**
     * @Route("/contact", name="contact")
     */
    public function contact()
    {
        return $this->render('app/contact.html.twig');
    }

    /**
     * @Route("/faq", name="faq")
     */
    public function faq()
    {
        return $this->render('app/faq.html.twig');
    }

    /**
     * @Route("/about", name="about")
     */
    public function about()
    {
        return $this->render('app/about.html.twig');
    }

    /**
     * @Route("/legal-notice", name="legalNotice")
     */
    public function legalNotice()
    {
        return $this->render('app/legalnotice.html.twig');
    }
}
