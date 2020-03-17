<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Form\LabelFormType;
use App\Entity\Label;

class LabelController extends AbstractController
{
    /**
     * @Route("/addlabel", name="add_label")
     */
    public function labelForm(Request $request)
    {
        // Formulaire de création d'un nouveau label
        $label = new Label();
        $labelForm = $this->createForm(LabelFormType::class, $label);
        $labelForm->handleRequest($request);

         // Traitement de l'envoi du formulaire
         if ($labelForm->isSubmitted() && $labelForm->isValid()) {

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($label);
            $entityManager->flush();


            return $this->redirectToRoute('add_label');
        }

        return $this->render('label/index.html.twig',[
            'labelForm'     => $labelForm->createView(),
        ]);
    }
}
