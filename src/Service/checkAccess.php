<?php

namespace App\Service;

use App\Entity\Access;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class checkAccess extends WebTestCase
{

    // public function setUp()
    // {
    //     $client = static::createClient();
    //     $this->entityManager = $client
    //         ->getContainer()
    //         ->get('doctrine')
    //         ->getManager();
    // }

    public function checkAccessUser($user, $project): bool
    {
        $access = $this->entityManager
            ->getRepository(Access::class)
            ->findAccessByUserAndProject($user, $project);
        ;

        //$access = $this->getDoctrine()->getRepository(Access::class)->findAccessByUserAndProject($user, $project);
        if ($access != null){
            return true;
        }else{
            return false;
        }
    }
}