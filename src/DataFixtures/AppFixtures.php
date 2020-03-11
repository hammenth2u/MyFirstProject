<?php

namespace App\DataFixtures;

use Faker\Factory;
use Nelmio\Alice\Loader\NativeLoader;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // pour préciser la langue
        $faker = Factory::create('fr_FR');
        // on injecte la variable $faker dans le loader du bundle Alice
        $loader = new NativeLoader($faker);
        // on précise le chemin vers le fichier fixtures.yaml
        // cete variable contient un tableau d'objets créés
        $entities = $loader->loadFile(__DIR__.'/fixtures.yaml')->getObjects();
        // on boucle sur ce tableau, et pour chaque objet, on fait persist
        foreach($entities as $entity) {
            $manager->persist($entity);
        }
        // on flush les données qui ont été persistées
        $manager->flush();
    }
}
