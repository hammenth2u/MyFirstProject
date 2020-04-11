<?php

namespace App\Service;
use Doctrine\ORM\EntityManagerInterface;
//use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\EntityManager;
use App\Entity\Access;
//use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class checkAccess extends EntityManager
{

    // public function setUp()
    // {
    //     $client = static::createClient();
    //     $this->entityManager = $client
    //         ->getContainer()
    //         ->get('doctrine')
    //         ->getManager();
    // }

    public function __construct(EntityManagerInterface $em)
    {
        $this->entityManager = $em;
    }

    public function checkAccessUser($user, $project): bool
    {
        $access = $this->entityManager->getRepository(Access::class)->findAccessByUserAndProject($user, $project);
        if ($access != null){
            return true;
        }else{
            return false;
        }
    }
}