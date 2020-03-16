<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Access;
use App\Entity\Project;

class ProjectController extends AbstractController
{
    /**
     * @Route("/p/{id}", name="showProject")
     */
    public function showProject(Project $project)
    {
        $user = $this->getUser();
        $projectName = $project->getName();

        $access = $this->getDoctrine()->getRepository(Access::class)->findAccessByUserAndProject($user, $project);

        //vérification des accès 
        if ($access !== []){
            return $this->render('project/index.html.twig', [
                'projectName' => $projectName,
            ]);
        } else {
            return $this->render('project/index.html.twig', [
                'projectName' => $projectName,
            ]);
        }
    }
}
